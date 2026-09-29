/** Mesmo formato de apps/engine/src/logs/format-timestamp.ts */
export function formatLogTimestamp(date: Date): string {
  const pad = (value: number, size = 2): string => String(value).padStart(size, '0')

  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`
}
