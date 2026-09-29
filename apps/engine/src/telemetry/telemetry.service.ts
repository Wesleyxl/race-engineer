/**
 * titulo: "Socket UDP da telemetria"
 * descricao: "Abre o UDP do simulador ativo, converte o datagram no TelemetryModel e registra no log ao vivo. Start/stop chegam pelo IPC."
 */

import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { createSocket, type Socket } from 'node:dgram'

import type { TelemetryModel } from '../core/model/telemetry.model'
import { LogService } from '../logs/log.service'
import type { SimulatorAdapter } from '../simulators/simulator.adapter'
import { SimulatorService } from '../simulators/simulator.service'

const SOURCE = 'telemetry'
const DEFAULT_UDP_HOST = '127.0.0.1'
const DEFAULT_UDP_PORT = 20777
const TELEMETRY_LOG_INTERVAL_MS = 2_000

export interface TelemetryStatus {
  ok: boolean
  running: boolean
  message: string
}

interface ParseOutcome {
  telemetry: TelemetryModel | null
  error: string | null
}

@Injectable()
export class TelemetryService implements OnModuleDestroy {
  private readonly udpHost = DEFAULT_UDP_HOST

  private socket: Socket | null = null
  private running = false
  private receivedOnce = false
  private lastLogAt = 0
  private latest: TelemetryModel | null = null

  constructor(
    private readonly logs: LogService,
    private readonly simulators: SimulatorService,
  ) {}

  isRunning(): boolean {
    return this.running
  }

  getLatest(): TelemetryModel | null {
    return this.latest
  }

  status(): TelemetryStatus {
    return {
      ok: true,
      running: this.running,
      message: this.running ? 'Telemetry running' : 'Telemetry stopped',
    }
  }

  async start(): Promise<TelemetryStatus> {
    if (this.running) {
      const message = 'Telemetry already running'
      this.logs.info(message, SOURCE)
      return { ok: true, running: true, message }
    }

    const active = this.simulators.getActive()
    if (!active) {
      const message = 'No simulator selected'
      this.logs.warn(message, SOURCE)
      return { ok: false, running: false, message }
    }

    const port = active.defaultUdpPort ?? DEFAULT_UDP_PORT

    try {
      await this.bindSocket(port)
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error)
      const message = `Error on UDP socket: ${detail}`
      this.logs.error(message, SOURCE)
      this.forceCleanup()
      return { ok: false, running: false, message }
    }

    const message = `UDP listening for telemetry on ${this.udpHost}:${port} (${active.name})`
    this.logs.ok(message, SOURCE)
    return { ok: true, running: true, message }
  }

  stop(): TelemetryStatus {
    if (!this.running || !this.socket) {
      const message = 'Telemetry already stopped'
      this.logs.info(message, SOURCE)
      return { ok: true, running: false, message }
    }

    this.forceCleanup()
    const message = 'Telemetry stopped'
    this.logs.ok(message, SOURCE)
    return { ok: true, running: false, message }
  }

  onModuleDestroy(): void {
    this.forceCleanup()
  }

  private bindSocket(port: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const socket = createSocket({ type: 'udp4', reuseAddr: true })
      this.socket = socket
      this.receivedOnce = false
      this.lastLogAt = 0

      const fail = (error: Error): void => {
        reject(error)
      }

      socket.once('error', fail)
      socket.on('message', (message: Buffer) => {
        this.handleMessage(message)
      })
      socket.once('listening', () => {
        socket.off('error', fail)
        socket.on('error', (error: Error) => {
          this.logs.error(`Error on UDP socket: ${error.message}`, SOURCE)
          this.forceCleanup()
        })
        this.running = true
        resolve()
      })

      try {
        socket.bind(port, this.udpHost)
      } catch (error) {
        fail(error instanceof Error ? error : new Error(String(error)))
      }
    })
  }

  private forceCleanup(): void {
    const socket = this.socket
    this.socket = null
    this.running = false
    this.receivedOnce = false

    if (!socket) return

    socket.removeAllListeners()
    try {
      socket.close()
    } catch {
      // socket já fechado
    }
  }

  private handleMessage(message: Buffer): void {
    const adapter = this.simulators.getActive()
    if (!adapter) {
      this.logs.warn('Packet ignored — no active simulator', SOURCE)
      return
    }

    const parsed = this.safeParse(adapter, message)
    const now = Date.now()

    if (!this.receivedOnce || now - this.lastLogAt >= TELEMETRY_LOG_INTERVAL_MS) {
      const first = !this.receivedOnce
      this.receivedOnce = true
      this.lastLogAt = now
      const detail = this.describe(adapter.id, message.length, parsed)

      if (parsed.error) this.logs.warn(detail, SOURCE)
      else if (first) this.logs.ok(detail, SOURCE)
      else this.logs.info(detail, SOURCE)
    }

    if (parsed.telemetry) this.publish(parsed.telemetry)
  }

  private safeParse(adapter: SimulatorAdapter, message: Buffer): ParseOutcome {
    try {
      return { telemetry: adapter.parse(message), error: null }
    } catch (error) {
      const text = error instanceof Error ? error.message : String(error)
      return { telemetry: null, error: text.slice(0, 300) }
    }
  }

  private describe(simulatorId: string, bytes: number, parsed: ParseOutcome): string {
    const base = `Receiving telemetry data — ${bytes} bytes via ${simulatorId}`
    if (parsed.error) return `${base} · parse error: ${parsed.error}`
    if (!parsed.telemetry) return base

    const { speedKmh, lap, gear } = parsed.telemetry
    return `${base} · ${speedKmh.toFixed(0)} km/h · lap ${lap} · gear ${gear}`
  }

  /**
   * O buffer já virou TelemetryModel.
   * Eventos, overlay, dashboard e wav entram aqui — não leem UDP.
   */
  private publish(telemetry: TelemetryModel): void {
    this.latest = telemetry
  }
}
