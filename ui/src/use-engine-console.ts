import { useEffect, useState } from 'react'

import type { LogEntry, SimulatorInfo } from './contract'

const LOG_LIMIT = 400

export function useEngineConsole() {
  const [bridgeMissing] = useState(() => window.raceEngine === undefined)
  const [ready, setReady] = useState(false)
  const [running, setRunning] = useState(false)
  const [busy, setBusy] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [simulators, setSimulators] = useState<SimulatorInfo[]>([])
  const [simulatorId, setSimulatorId] = useState('')

  useEffect(() => {
    const api = window.raceEngine
    if (!api) return

    let active = true

    const append = (entry: LogEntry): void => {
      setLogs((current) => {
        if (current.some((item) => item.id === entry.id)) return current
        const next = [...current, entry]
        return next.length > LOG_LIMIT ? next.slice(next.length - LOG_LIMIT) : next
      })
      if (entry.source === 'app' && entry.message.startsWith('App is ready')) {
        setReady(true)
      }
    }

    const unsubscribe = api.onLog(append)

    void api.getLogs().then((entries) => {
      if (!active) return
      entries.forEach(append)
    })
    void api.notifyUiReady().then((status) => {
      if (active && status.ready) setReady(true)
    })
    void api.listSimulators().then((result) => {
      if (!active) return
      setSimulators(result.simulators ?? [])
      if (result.simulatorId) setSimulatorId(result.simulatorId)
    })
    void api.telemetryStatus().then((result) => {
      if (active) setRunning(Boolean(result.running))
    })

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  async function selectSimulator(nextId: string): Promise<void> {
    const api = window.raceEngine
    if (!api) return
    setSimulatorId(nextId)
    await api.selectSimulator(nextId)
  }

  async function start(): Promise<void> {
    const api = window.raceEngine
    if (!api) return
    setBusy(true)
    try {
      const result = await api.startTelemetry()
      setRunning(Boolean(result.running))
    } finally {
      setBusy(false)
    }
  }

  async function stop(): Promise<void> {
    const api = window.raceEngine
    if (!api) return
    setBusy(true)
    try {
      const result = await api.stopTelemetry()
      setRunning(Boolean(result.running))
    } finally {
      setBusy(false)
    }
  }

  return {
    bridgeMissing,
    ready,
    running,
    busy,
    logs,
    simulators,
    simulatorId,
    selectSimulator,
    start,
    stop,
  }
}
