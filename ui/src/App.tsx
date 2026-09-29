import { useEffect, useRef, type ChangeEvent } from 'react'

import type { LogEntry, SimulatorInfo } from './contract'
import { useEngineConsole } from './use-engine-console'
import './App.css'

const LEVEL_LABEL: Record<LogEntry['level'], string> = {
  info: 'INFO',
  ok: 'OK',
  warn: 'WARN',
  error: 'ERR',
}

function App() {
  const consoleState = useEngineConsole()
  const endRef = useRef<HTMLElement | null>(null)
  const active = consoleState.simulators.find((item) => item.id === consoleState.simulatorId)
  const status = statusLabel(consoleState.bridgeMissing, consoleState.ready, consoleState.running)

  useEffect(() => {
    const node = endRef.current
    if (!node) return
    node.scrollTop = node.scrollHeight
  }, [consoleState.logs])

  return (
    <main className="shell">
      <header className="bar">
        <div className="brand">
          <span className={consoleState.running ? 'live-dot on' : 'live-dot'} aria-hidden="true" />
          <div>
            <h1>Race Engineer</h1>
            <p>{status}</p>
          </div>
        </div>

        <label className="simulator">
          Simulador
          <select
            value={consoleState.simulatorId}
            disabled={consoleState.bridgeMissing || consoleState.simulators.length === 0}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => {
              void consoleState.selectSimulator(event.target.value)
            }}
          >
            {consoleState.simulators.map((simulator) => (
              <option key={simulator.id} value={simulator.id}>
                {simulator.name}
              </option>
            ))}
          </select>
        </label>

        <div className="actions">
          <button
            type="button"
            className="start"
            disabled={!consoleState.ready || consoleState.running || consoleState.busy}
            onClick={() => {
              void consoleState.start()
            }}
          >
            Iniciar
          </button>
          <button
            type="button"
            className="stop"
            disabled={!consoleState.running || consoleState.busy}
            onClick={() => {
              void consoleState.stop()
            }}
          >
            Parar
          </button>
        </div>
      </header>

      <p className="hint">{hintFor(consoleState.bridgeMissing, active)}</p>

      <section
        ref={endRef}
        className="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-label="Registro de log"
      >
        {consoleState.logs.length === 0 ? (
          <p className="empty">Nenhum evento ainda.</p>
        ) : (
          <ol>
            {consoleState.logs.map((entry) => (
              <li key={entry.id} className={`row ${entry.level}`}>
                <time dateTime={new Date(entry.epochMs).toISOString()}>{entry.timestamp}</time>
                <span className="level">{LEVEL_LABEL[entry.level]}</span>
                <span className="source">{entry.source}</span>
                <span className="message">{entry.message}</span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  )
}

function statusLabel(bridgeMissing: boolean, ready: boolean, running: boolean): string {
  if (bridgeMissing) return 'Sem ponte IPC'
  if (!ready) return 'Conectando engine e interface'
  if (running) return 'UDP ativo'
  return 'Pronto para iniciar'
}

function hintFor(bridgeMissing: boolean, active: SimulatorInfo | undefined): string {
  if (bridgeMissing) return 'Abra pelo Electron para receber os logs.'
  if (!active?.defaultUdpPort) return 'Registro ao vivo do que o engine está fazendo.'
  return `${active.name} · UDP 127.0.0.1:${active.defaultUdpPort}`
}

export default App
