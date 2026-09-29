import { spawn, type ChildProcess } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { existsSync } from 'node:fs'
import path from 'node:path'

import { app, BrowserWindow, dialog, ipcMain, Menu } from 'electron'

import { Channel } from './channels'
import type { CommandResult, LogEntry } from './contract'
import { startUiDevServer, killProcessTree, VITE_URL, waitForHttp } from './dev-server'
import { EngineHost } from './engine-host'
import { formatLogTimestamp } from './format-log-timestamp'

const LOG_LIMIT = 400
const desktopRoot = path.resolve(__dirname, '..')
const repoRoot = path.resolve(desktopRoot, '../..')
const engineDir = path.join(repoRoot, 'apps', 'engine')
const uiDir = path.join(repoRoot, 'ui')

const logs: LogEntry[] = []
let engine: EngineHost | null = null
let uiProcess: ChildProcess | null = null
let announced = false
let readyFlight: Promise<{ ready: boolean }> | null = null
let shuttingDown = false

function pushLog(entry: LogEntry): void {
  logs.push(entry)
  if (logs.length > LOG_LIMIT) logs.shift()

  for (const win of BrowserWindow.getAllWindows()) {
    win.webContents.send(Channel.log, entry)
  }
}

function resolveNodeBinary(): string {
  const fromNpm = process.env.npm_node_execpath
  if (fromNpm && fromNpm.length > 0) return fromNpm
  return 'node'
}

function resolveEngineEntry(): string {
  const candidates = [
    path.join(engineDir, 'dist', 'main.js'),
    path.join(engineDir, 'dist', 'src', 'main.js'),
  ]
  const found = candidates.find((candidate) => existsSync(candidate))
  if (!found) throw new Error('Engine build did not emit main.js')
  return found
}

function run(command: string, args: string[], cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, env: process.env, stdio: 'inherit' })
    child.once('error', reject)
    child.once('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${command} ${args.join(' ')} saiu com código ${code}`))
    })
  })
}

function announce(host: EngineHost): Promise<{ ready: boolean }> {
  if (announced) return Promise.resolve({ ready: true })
  if (!readyFlight) {
    readyFlight = host.request({ type: 'app:ready' }).then((result) => {
      announced = result.ok
      if (!result.ok) pushLog(failureLog(result.message))
      return { ready: result.ok }
    })
  }
  return readyFlight
}

function failureLog(message: string): LogEntry {
  const now = new Date()
  return {
    id: randomUUID(),
    timestamp: formatLogTimestamp(now),
    epochMs: now.getTime(),
    level: 'error',
    source: 'desktop',
    message,
  }
}

function registerIpc(host: EngineHost): void {
  ipcMain.handle(Channel.logsHistory, () => logs)
  ipcMain.handle(Channel.uiReady, () => announce(host))
  ipcMain.handle(Channel.telemetryStart, () => host.request({ type: 'telemetry:start' }))
  ipcMain.handle(Channel.telemetryStop, () => host.request({ type: 'telemetry:stop' }))
  ipcMain.handle(Channel.telemetryStatus, () => host.request({ type: 'telemetry:status' }))
  ipcMain.handle(Channel.simulatorList, () => host.request({ type: 'simulator:list' }))
  ipcMain.handle(
    Channel.simulatorSelect,
    (_event, simulatorId: unknown): Promise<CommandResult> => {
      if (typeof simulatorId !== 'string' || simulatorId.length === 0) {
        return Promise.resolve({ ok: false, message: 'Simulator id is required' })
      }
      return host.request({ type: 'simulator:select', simulatorId })
    },
  )
}

async function createWindow(): Promise<void> {
  const win = new BrowserWindow({
    width: 1120,
    height: 760,
    minWidth: 800,
    minHeight: 520,
    show: false,
    backgroundColor: '#10140f',
    autoHideMenuBar: true,
    title: 'Race Engineer',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  win.webContents.on('did-finish-load', () => {
    void win.webContents
      .executeJavaScript('typeof window.raceEngine')
      .then((value: unknown) => {
        console.info(`Ponte IPC no renderer: ${String(value)}`)
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error)
        console.error(`Não foi possível ler a ponte IPC: ${message}`)
      })
  })
  win.webContents.on('did-fail-load', (_event, code, description, url) => {
    console.error(`Falha ao carregar a interface: ${description} (${code}) ${url}`)
  })
  win.webContents.on('preload-error', (_event, preloadPath, error) => {
    console.error(`Falha no preload ${preloadPath}: ${error.message}`)
  })
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))
  win.webContents.on('will-navigate', (event, url) => {
    const allowed = url === VITE_URL || url.startsWith(`${VITE_URL}/`)
    if (!allowed) event.preventDefault()
  })

  win.once('ready-to-show', () => {
    win.show()
  })

  await win.loadURL(VITE_URL)
}

function shutdown(): void {
  if (shuttingDown) return
  shuttingDown = true
  engine?.stop()
  killProcessTree(uiProcess)
  uiProcess = null
}

async function boot(): Promise<void> {
  console.info('Compilando engine...')
  await run('npm', ['run', 'build'], engineDir)

  const host = new EngineHost(pushLog)
  engine = host
  host.start({
    entry: resolveEngineEntry(),
    cwd: engineDir,
    execPath: resolveNodeBinary(),
  })

  uiProcess = startUiDevServer(uiDir)

  try {
    await Promise.all([host.ready, waitForHttp(VITE_URL, 30_000)])
  } catch (error) {
    host.stop()
    killProcessTree(uiProcess)
    throw error
  }

  registerIpc(host)
  await createWindow()
}

Menu.setApplicationMenu(null)
// No WSL o sandbox e a GPU do Chromium encerram a janela no boot.
app.commandLine.appendSwitch('disable-gpu')
app.commandLine.appendSwitch('no-sandbox')
app.disableHardwareAcceleration()

app.on('before-quit', shutdown)
app.on('window-all-closed', () => {
  app.quit()
})

process.on('SIGINT', () => {
  shutdown()
  app.quit()
})

void app.whenReady().then(boot).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  dialog.showErrorBox('Race Engineer', message)
  shutdown()
  app.quit()
})
