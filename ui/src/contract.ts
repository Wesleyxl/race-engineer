export type LogLevel = 'info' | 'ok' | 'warn' | 'error'

export interface LogEntry {
  id: string
  timestamp: string
  epochMs: number
  level: LogLevel
  source: string
  message: string
}

export interface SimulatorInfo {
  id: string
  name: string
  description?: string
  defaultUdpPort?: number
}

export interface CommandResult {
  ok: boolean
  message: string
  running?: boolean
  simulators?: SimulatorInfo[]
  simulatorId?: string | null
}

export interface RaceEngineApi {
  onLog: (callback: (entry: LogEntry) => void) => () => void
  getLogs: () => Promise<LogEntry[]>
  notifyUiReady: () => Promise<{ ready: boolean }>
  startTelemetry: () => Promise<CommandResult>
  stopTelemetry: () => Promise<CommandResult>
  telemetryStatus: () => Promise<CommandResult>
  listSimulators: () => Promise<CommandResult>
  selectSimulator: (simulatorId: string) => Promise<CommandResult>
}

declare global {
  interface Window {
    raceEngine?: RaceEngineApi
  }
}
