import { spawn, type ChildProcess } from 'node:child_process'

export const VITE_URL = 'http://127.0.0.1:5173'

export function startUiDevServer(uiDir: string): ChildProcess {
  return spawn(
    'npm',
    ['run', 'dev', '--', '--host', '127.0.0.1', '--port', '5173', '--strictPort'],
    {
      cwd: uiDir,
      env: process.env,
      detached: true,
      stdio: 'inherit',
    },
  )
}

export async function waitForHttp(url: string, timeoutMs: number): Promise<void> {
  const started = Date.now()

  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url)
      if (response.ok || response.status < 500) return
    } catch {
      // Vite ainda está subindo.
    }
    await delay(250)
  }

  throw new Error(`Timeout waiting for ${url}`)
}

export function killProcessTree(child: ChildProcess | null): void {
  if (!child?.pid) return

  try {
    process.kill(-child.pid, 'SIGTERM')
  } catch {
    child.kill('SIGTERM')
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
