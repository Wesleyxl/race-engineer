import { Injectable } from '@nestjs/common'

import { LogService } from '../logs/log.service'
import { createSimulatorAdapters } from './simulator.factory'
import { toSimulatorInfo, type SimulatorAdapter, type SimulatorInfo } from './simulator.adapter'

export interface SimulatorCommandResult {
  ok: boolean
  message: string
  simulatorId: string | null
}

@Injectable()
export class SimulatorService {
  private readonly adapters: SimulatorAdapter[]
  private activeId: string | null

  constructor(private readonly logs: LogService) {
    this.adapters = createSimulatorAdapters()
    this.activeId = this.adapters[0]?.id ?? null
  }

  list(): SimulatorInfo[] {
    return this.adapters.map((adapter) => toSimulatorInfo(adapter))
  }

  getActiveId(): string | null {
    return this.activeId
  }

  getActive(): SimulatorAdapter | null {
    return this.adapters.find((adapter) => adapter.id === this.activeId) ?? null
  }

  select(simulatorId: string): SimulatorCommandResult {
    const adapter = this.adapters.find((item) => item.id === simulatorId)
    if (!adapter) {
      const message = `Unknown simulator: ${simulatorId}`
      this.logs.warn(message, 'simulator')
      return { ok: false, message, simulatorId: this.activeId }
    }

    this.activeId = adapter.id
    const message = `Simulator set to ${adapter.name} (${adapter.id})`
    this.logs.ok(message, 'simulator')
    return { ok: true, message, simulatorId: adapter.id }
  }
}
