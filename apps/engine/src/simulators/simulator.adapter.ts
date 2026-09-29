/**
 * title: "SimulatorAdapter contract"
 * description: "id, name, optional UDP port and parse(Buffer) → TelemetryModel | null. Every new game implements this. toSimulatorInfo removes the parse before sending to the UI."
 */

import { TelemetryModel } from '../core/model/telemetry.model'

/**
 * Contract for each simulator.
 * To add a new one: create an adapter in `adapters/` and register in the factory.
 */
export interface SimulatorAdapter {
  /** stable id (used in select / WS) */
  readonly id: string

  /** name displayed in the UI */
  readonly name: string

  /** short description (optional) */
  readonly description?: string

  /** default UDP port of the game (optional) */
  readonly defaultUdpPort?: number

  /**
   * Converts the raw UDP buffer to the canonical model.
   * Return `null` if the packet is invalid / not implemented.
   */
  parse(buffer: Buffer): TelemetryModel | null
}

/** Public info sent to the UI (without the parse). */
export type SimulatorInfo = {
  id: string
  name: string
  description?: string
  defaultUdpPort?: number
}

export function toSimulatorInfo(adapter: SimulatorAdapter): SimulatorInfo {
  return {
    id: adapter.id,
    name: adapter.name,
    description: adapter.description,
    defaultUdpPort: adapter.defaultUdpPort,
  }
}
