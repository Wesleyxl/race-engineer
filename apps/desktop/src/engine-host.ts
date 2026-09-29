import { randomUUID } from 'node:crypto'
import { fork, type ChildProcess } from 'node:child_process'

import { isLogEntry, readCommandResult, type CommandResult, type LogEntry, type LogLevel } from './contract'
import { formatLogTimestamp } from './format-log-timestamp'

const REQUEST_TIMEOUT_MS = 8_000

export interface EngineStartOptions {
  entry: string
  cwd: string
  execPath: string
}

type EngineCommand =
  | { type: 'app:ready' }
  | { type: 'telemetry:start' }
  | { type: 'telemetry:stop' }
  | { type: 'telemetry:status' }
  | { type: 'simulator:list' }
  | { type: 'simulator:select'; simulatorId: string }

interface Waiter {
  resolve: (result: CommandResult) => void
}

/**
 * Processo do Nest ligado por IPC (fork + process.send).
 * Cada log do ReplaySubject chega aqui e segue para a janela.
 */
export class EngineHost {
  private child: ChildProcess | null = null
  private stopping = false
  private settled = false
  private readonly waiters = new Map<string, Waiter>()
  private readonly resolveReady: () => void
  private readonly rejectReady: (error: Error) => void

  readonly ready: Promise<void>

  constructor(private readonly onLog: (entry: LogEntry) => void) {
    let resolveReady: () => void = () => undefined
    let rejectReady: (error: Error) => void = () => undefined
    this.ready = new Promise<void>((resolve, reject) => {
      resolveReady = resolve
      rejectReady = reject
    })
    this.resolveReady = resolveReady
    this.rejectReady = rejectReady
    this.ready.catch(() => undefined)
  }

  start(options: EngineStartOptions): void {
    const env: NodeJS.ProcessEnv = { ...process.env, RACE_ENGINE_IPC: '1' }
    delete env.ELECTRON_RUN_AS_NODE

    this.child = fork(options.entry, [], {
      cwd: options.cwd,
      execPath: options.execPath,
      env,
      stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
    })

    this.child.on('message', (message: unknown) => {
      this.onMessage(message)
    })
    this.child.on('error', (error: Error) => {
      this.failReady(error)
    })
    this.child.on('exit', (code: number | null) => {
      this.onExit(code)
    })
  }

  request(command: EngineCommand): Promise<CommandResult> {
    const child = this.child
    if (!child || child.exitCode !== null || !child.connected) {
      return Promise.resolve({ ok: false, message: 'Engine is not connected' })
    }

    const requestId = randomUUID()
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        this.waiters.delete(requestId)
        resolve({ ok: false, message: 'Engine did not respond' })
      }, REQUEST_TIMEOUT_MS)

      this.waiters.set(requestId, {
        resolve: (result) => {
          clearTimeout(timer)
          resolve(result)
        },
      })

      const sent = child.send({ ...command, requestId })
      if (!sent) {
        clearTimeout(timer)
        this.waiters.delete(requestId)
        resolve({ ok: false, message: 'Engine is not connected' })
      }
    })
  }

  stop(): void {
    this.stopping = true
    this.failPending('Engine stopped')
    if (this.child && this.child.exitCode === null) {
      this.child.kill('SIGTERM')
    }
  }

  private onMessage(message: unknown): void {
    if (typeof message !== 'object' || message === null) return
    const record = message as Record<string, unknown>

    if (record.type === 'engine:ready') {
      this.settleReady()
      return
    }

    if (record.type === 'log' && isLogEntry(record.entry)) {
      this.onLog(record.entry)
      return
    }

    if (record.type !== 'result' || typeof record.requestId !== 'string') return
    const waiter = this.waiters.get(record.requestId)
    if (!waiter) return
    this.waiters.delete(record.requestId)
    waiter.resolve(readCommandResult(record))
  }

  private onExit(code: number | null): void {
    const error = new Error(`Engine exited before ready (${code ?? 'null'})`)
    this.failReady(error)
    this.failPending('Engine is not connected')
    if (this.stopping) return
    this.onLog(localLog('error', 'desktop', `Engine stopped (code ${code ?? 'null'})`))
  }

  private settleReady(): void {
    if (this.settled) return
    this.settled = true
    this.resolveReady()
  }

  private failReady(error: Error): void {
    if (this.settled) return
    this.settled = true
    this.rejectReady(error)
  }

  private failPending(message: string): void {
    for (const waiter of this.waiters.values()) {
      waiter.resolve({ ok: false, message })
    }
    this.waiters.clear()
  }
}

function localLog(level: LogLevel, source: string, message: string): LogEntry {
  const now = new Date()
  return {
    id: randomUUID(),
    timestamp: formatLogTimestamp(now),
    epochMs: now.getTime(),
    level,
    source,
    message,
  }
}
