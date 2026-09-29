/**
 * title: "Registration of game adapters"
 * description: "Single place to instantiate simulators. Today F1 25. New game: create an adapter like f1-25 and add it to this array — the UI select and the UDP pick it up."
 */

import { SimulatorAdapter } from './simulator.adapter'
import { F125Adapter } from './adapters/f1-25/adapter'

/**
 * Single place to register compatible simulators.
 *
 * To add a new one:
 * 1. Create `adapters/my-sim/adapter.ts` implementing `SimulatorAdapter`
 * 2. Instantiate below in `createSimulatorAdapters()`
 * 3. Ready — appears in the select of the UI and the TelemetryService uses the active parse
 */
export function createSimulatorAdapters(): SimulatorAdapter[] {
  return [
    new F125Adapter(),
  ]
}
