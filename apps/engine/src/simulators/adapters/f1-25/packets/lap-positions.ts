/**
 * Lap Positions Packet
 * Frequency: 1/s | Size: 1131 bytes | Version: 1 | PacketId: 15
 *
 * Position of each car at the start of each lap (max. 50 laps per packet).
 * If there are more than 50 laps, two packets are sent with different lapStart.
 */

import type { PacketHeader } from './header';

export interface PacketLapPositionsData {
  header: PacketHeader;
  numLaps: number;
  /** Index of the lap where the data starts (0-indexed) */
  lapStart: number;
  /**
   * positionForVehicleIdx[lap][carIdx]
   * 0 = no record. Max 50 laps × 22 cars.
   */
  positionForVehicleIdx: number[][];
}
