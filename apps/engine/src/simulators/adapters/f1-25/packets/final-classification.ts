/**
 * Final Classification Packet
 * Frequency: once at the end of the race | Size: 1042 bytes | Version: 1 | PacketId: 8
 */

import type { PacketHeader } from './header';

export interface FinalClassificationData {
  position: number;
  numLaps: number;
  gridPosition: number;
  points: number;
  numPitStops: number;
  /**
   * 0 = invalid, 1 = inactive, 2 = active, 3 = finished,
   * 4 = DNF, 5 = DSQ, 6 = not classified, 7 = retired
   */
  resultStatus: number;
  /**
   * 0 = invalid, 1 = retired, 2 = finished, 3 = terminal damage,
   * 4 = inactive, 5 = not enough laps, 6 = black flagged,
   * 7 = red flagged, 8 = mechanical failure, 9 = session skipped,
   * 10 = session simulated
   */
  resultReason: number;
  bestLapTimeInMS: number;
  /** Total time without penalties (seconds) */
  totalRaceTime: number;
  penaltiesTime: number;
  numPenalties: number;
  numTyreStints: number;
  tyreStintsActual: number[];
  tyreStintsVisual: number[];
  /** Lap in which each stint ends */
  tyreStintsEndLaps: number[];
}

export interface PacketFinalClassificationData {
  header: PacketHeader;
  numCars: number;
  classificationData: FinalClassificationData[];
}
