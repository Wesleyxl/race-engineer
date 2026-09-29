/**
 * Session History Packet
 * Frequency: 20/s looping cars | Size: 1460 bytes | Version: 1 | PacketId: 11
 *
 * Each packet refers to a specific car.
 */

import type { PacketHeader } from './header';

export interface LapHistoryData {
  lapTimeInMS: number;
  sector1TimeMSPart: number;
  sector1TimeMinutesPart: number;
  sector2TimeMSPart: number;
  sector2TimeMinutesPart: number;
  sector3TimeMSPart: number;
  sector3TimeMinutesPart: number;
  /**
   * 0x01 = lap valid, 0x02 = sector1 valid,
   * 0x04 = sector2 valid, 0x08 = sector3 valid
   */
  lapValidBitFlags: number;
}

export interface TyreStintHistoryData {
  /** 255 = current tyre */
  endLap: number;
  tyreActualCompound: number;
  tyreVisualCompound: number;
}

export interface PacketSessionHistoryData {
  header: PacketHeader;
  carIdx: number;
  /** Includes current partial lap */
  numLaps: number;
  numTyreStints: number;
  bestLapTimeLapNum: number;
  bestSector1LapNum: number;
  bestSector2LapNum: number;
  bestSector3LapNum: number;
  /** Max 100 */
  lapHistoryData: LapHistoryData[];
  /** Max 8 */
  tyreStintsHistoryData: TyreStintHistoryData[];
}
