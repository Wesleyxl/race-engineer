import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import type { Subscription } from 'rxjs'

import { formatLogTimestamp } from '../logs/format-timestamp'
import { LogService } from '../logs/log.service'
import { SimulatorService } from '../simulators/simulator.service'
import { TelemetryService } from '../telemetry/telemetry.service'
import { parseIpcCommand, type CommandResult, type IpcCommand, type IpcOutbound } from './ipc.protocol'

@Injectable()
export class IpcGateway implements OnModuleInit, OnModuleDestroy {
  private subscription: Subscription | null = null
  private readonly handleMessage = (message: unknown): void => {
    void this.handle(message)
  }

  constructor(
    private readonly logs: LogService,
    private readonly simulators: SimulatorService,
    private readonly telemetry: TelemetryService,
  ) {}

  onModuleInit(): void {
    if (typeof process.send !== 'function') {
      this.logs.warn('IPC channel unavailable — start the app from Electron', 'ipc')
      return
    }

    this.subscription = this.logs.entries$.subscribe((entry) => {
      this.send({ type: 'log', entry })
    })
    process.on('message', this.handleMessage)

    const active = this.simulators.getActive()
    if (active) {
      this.logs.info(`Active simulator: ${active.name} (${active.id})`, 'simulator')
    }

    this.logs.ok('Engine connected', 'engine')
    this.send({ type: 'engine:ready' })
  }

  onModuleDestroy(): void {
    process.off('message', this.handleMessage)
    this.subscription?.unsubscribe()
    this.subscription = null
  }

  private async handle(message: unknown): Promise<void> {
    const command = parseIpcCommand(message)
    if (!command) {
      this.logs.warn('Ignored invalid IPC command', 'ipc')
      return
    }

    try {
      const result = await this.dispatch(command)
      this.send({ type: 'result', requestId: command.requestId, ...result })
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error)
      this.logs.error(detail.slice(0, 300), 'ipc')
      this.send({
        type: 'result',
        requestId: command.requestId,
        ok: false,
        message: 'Something went wrong',
      })
    }
  }

  private async dispatch(command: IpcCommand): Promise<CommandResult> {
    switch (command.type) {
      case 'app:ready': {
        const now = new Date()
        this.logs.ok(`App is ready — ${formatLogTimestamp(now)}`, 'app', now)
        return { ok: true, message: 'App is ready' }
      }
      case 'telemetry:start':
        return this.telemetry.start()
      case 'telemetry:stop':
        return this.telemetry.stop()
      case 'telemetry:status':
        return this.telemetry.status()
      case 'simulator:list':
        return {
          ok: true,
          message: 'Simulators listed',
          simulators: this.simulators.list(),
          simulatorId: this.simulators.getActiveId(),
        }
      case 'simulator:select':
        return this.simulators.select(command.simulatorId)
      default:
        return { ok: false, message: 'Something went wrong' }
    }
  }

  private send(message: IpcOutbound): void {
    if (typeof process.send !== 'function') return
    process.send(message)
  }
}
