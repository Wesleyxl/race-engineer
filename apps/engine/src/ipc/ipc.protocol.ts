import type { LogEntry } from '../logs/log.types'
import type { SimulatorInfo } from '../simulators/simulator.adapter'

const SIMPLE_COMMANDS = [
  'app:ready',
  'telemetry:start',
  'telemetry:stop',
  'telemetry:status',
  'simulator:list',
] as const

type SimpleCommandType = (typeof SIMPLE_COMMANDS)[number]

export type IpcCommand =
  | { type: SimpleCommandType; requestId: string }
  | { type: 'simulator:select'; requestId: string; simulatorId: string }

export interface CommandResult {
  ok: boolean
  message: string
  running?: boolean
  simulators?: SimulatorInfo[]
  simulatorId?: string | null
}

export type IpcResult = CommandResult & {
  type: 'result'
  requestId: string
}

export type IpcOutbound =
  | IpcResult
  | { type: 'log'; entry: LogEntry }
  | { type: 'engine:ready' }

const MAX_ID_LENGTH = 80

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isSimpleCommand(type: string): type is SimpleCommandType {
  return (SIMPLE_COMMANDS as readonly string[]).includes(type)
}

function isRequestId(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && value.length <= MAX_ID_LENGTH
}

/** Valida o que chega do Electron antes de executar qualquer comando. */
export function parseIpcCommand(value: unknown): IpcCommand | null {
  if (!isRecord(value) || !isRequestId(value.requestId) || typeof value.type !== 'string') {
    return null
  }

  if (isSimpleCommand(value.type)) {
    return { type: value.type, requestId: value.requestId }
  }

  if (value.type !== 'simulator:select') return null
  if (typeof value.simulatorId !== 'string') return null
  if (value.simulatorId.length === 0 || value.simulatorId.length > MAX_ID_LENGTH) return null

  return {
    type: 'simulator:select',
    requestId: value.requestId,
    simulatorId: value.simulatorId,
  }
}
