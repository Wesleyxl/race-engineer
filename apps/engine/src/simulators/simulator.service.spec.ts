import { LogService } from '../logs/log.service'
import { SimulatorService } from './simulator.service'

describe('SimulatorService', () => {
  it('sobe com o F1 25 ativo e recusa id desconhecido', () => {
    const service = new SimulatorService(new LogService())

    expect(service.getActiveId()).toBe('f1-25')
    expect(service.list().map((item) => item.id)).toContain('f1-25')

    const missing = service.select('acc')
    expect(missing.ok).toBe(false)
    expect(service.getActiveId()).toBe('f1-25')

    const selected = service.select('f1-25')
    expect(selected.ok).toBe(true)
    expect(selected.simulatorId).toBe('f1-25')
  })
})
