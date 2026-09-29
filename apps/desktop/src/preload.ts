import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron'

import type { CommandResult, LogEntry } from './contract'

// O sandbox do Electron não resolve require relativo no preload.
// Os nomes batem com apps/desktop/src/channels.ts.
const Channel = {
  log: 'log:entry',
  logsHistory: 'logs:history',
  uiReady: 'ui:ready',
  telemetryStart: 'telemetry:start',
  telemetryStop: 'telemetry:stop',
  telemetryStatus: 'telemetry:status',
  simulatorSelect: 'simulator:select',
  simulatorList: 'simulator:list',
} as const

contextBridge.exposeInMainWorld('raceEngine', {
  onLog(callback: (entry: LogEntry) => void): () => void {
    const listener = (_event: IpcRendererEvent, entry: LogEntry): void => {
      callback(entry)
    }
    ipcRenderer.on(Channel.log, listener)
    return () => {
      ipcRenderer.removeListener(Channel.log, listener)
    }
  },
  getLogs(): Promise<LogEntry[]> {
    return ipcRenderer.invoke(Channel.logsHistory)
  },
  notifyUiReady(): Promise<{ ready: boolean }> {
    return ipcRenderer.invoke(Channel.uiReady)
  },
  startTelemetry(): Promise<CommandResult> {
    return ipcRenderer.invoke(Channel.telemetryStart)
  },
  stopTelemetry(): Promise<CommandResult> {
    return ipcRenderer.invoke(Channel.telemetryStop)
  },
  telemetryStatus(): Promise<CommandResult> {
    return ipcRenderer.invoke(Channel.telemetryStatus)
  },
  listSimulators(): Promise<CommandResult> {
    return ipcRenderer.invoke(Channel.simulatorList)
  },
  selectSimulator(simulatorId: string): Promise<CommandResult> {
    return ipcRenderer.invoke(Channel.simulatorSelect, simulatorId)
  },
})
