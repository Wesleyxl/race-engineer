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

const LEVELS: ReadonlySet<string> = new Set(['info', 'ok', 'warn', 'error'])

export function isLogEntry(value: unknown): value is LogEntry {
  if (typeof value !== 'object' || value === null) return false
  const record = value as Record<string, unknown>
  return (
    typeof record.id === 'string' &&
    typeof record.timestamp === 'string' &&
    typeof record.epochMs === 'number' &&
    typeof record.level === 'string' &&
    LEVELS.has(record.level) &&
    typeof record.source === 'string' &&
    typeof record.message === 'string'
  )
}

export function readSimulators(value: unknown): SimulatorInfo[] | undefined {
  if (!Array.isArray(value)) return undefined

  const simulators: SimulatorInfo[] = []
  for (const item of value) {
    if (typeof item !== 'object' || item === null) continue
    const record = item as Record<string, unknown>
    if (typeof record.id !== 'string' || typeof record.name !== 'string') continue
    simulators.push({
      id: record.id,
      name: record.name,
      description: typeof record.description === 'string' ? record.description : undefined,
      defaultUdpPort: typeof record.defaultUdpPort === 'number' ? record.defaultUdpPort : undefined,
    })
  }

  return simulators
}

export function readCommandResult(value: unknown): CommandResult {
  if (typeof value !== 'object' || value === null) {
    return { ok: false, message: 'Something went wrong' }
  }

  const record = value as Record<string, unknown>
  const simulatorId =
    typeof record.simulatorId === 'string' || record.simulatorId === null
      ? record.simulatorId
      : undefined

  return {
    ok: record.ok === true,
    message: typeof record.message === 'string' ? record.message : 'Something went wrong',
    running: typeof record.running === 'boolean' ? record.running : undefined,
    simulators: readSimulators(record.simulators),
    simulatorId,
  }
}
