import { parseIpcCommand } from './ipc.protocol'

describe('parseIpcCommand', () => {
  it('aceita start com requestId', () => {
    expect(parseIpcCommand({ type: 'telemetry:start', requestId: '1' })).toEqual({
      type: 'telemetry:start',
      requestId: '1',
    })
  })

  it('recusa comando desconhecido', () => {
    expect(parseIpcCommand({ type: 'shell', requestId: '1' })).toBeNull()
  })

  it('exige simulatorId no select', () => {
    expect(parseIpcCommand({ type: 'simulator:select', requestId: '1' })).toBeNull()
    expect(
      parseIpcCommand({ type: 'simulator:select', requestId: '1', simulatorId: 'f1-25' }),
    ).toEqual({
      type: 'simulator:select',
      requestId: '1',
      simulatorId: 'f1-25',
    })
  })
})
