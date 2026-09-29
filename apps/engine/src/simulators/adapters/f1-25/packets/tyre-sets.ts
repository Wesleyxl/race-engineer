/**
 * Tyre Sets Packet
 * Frequency: 20/s looping cars | Size: 231 bytes | Version: 1 | PacketId: 12
 */

import type { PacketHeader } from './header';

export interface TyreSetData {
  actualTyreCompound: number;
  visualTyreCompound: number;
  /** Wear (%) */
  wear: number;
  available: number;
  /** Recommended session — see appendix */
  recommendedSession: number;
  /** Remaining laps in this set */
  lifeSpan: number;
  /** Maximum laps recommended for the compound */
  usableLife: number;
  /** Delta of lap vs fitted (ms) */
  lapDeltaTime: number;
  fitted: number;
}

export interface PacketTyreSetsData {
  header: PacketHeader;
  carIdx: number;
  /** 13 dry + 7 wet = 20 */
  tyreSetData: TyreSetData[];
  /** Index of the fitted tyre in the array */
  fittedIdx: number;
}
