/**
 * Car Status Packet
 * Frequency: rate of the menu | Size: 1239 bytes | Version: 1 | PacketId: 7
 */

import type { PacketHeader } from './header';

export interface CarStatusData {
  /** 0 = off, 1 = medium, 2 = full */
  tractionControl: number;

  /** 0 = off, 1 = on */
  antiLockBrakes: number;

  /** 0 = lean, 1 = standard, 2 = rich, 3 = max */

  fuelMix: number;
  /** Front brake bias (%) */
  frontBrakeBias: number;

  /** 0 = off, 1 = on */
  pitLimiterStatus: number;
  fuelInTank: number;
  fuelCapacity: number;

  /** Remaining fuel in laps (MFD) */
  fuelRemainingLaps: number;
  maxRPM: number;
  idleRPM: number;
  maxGears: number;

  /** 0 = not allowed, 1 = allowed */
  drsAllowed: number;

  /** 0 = DRS unavailable; otherwise meters until activation */
  drsActivationDistance: number;

  /**
   * F1 Modern: 16=C5 ... 22=C6, 7=inter, 8=wet
   * F1 Classic: 9=dry, 10=wet
   * F2: 11–15
   */
  actualTyreCompound: number;

  /**
   * Visual F1: 16=soft, 17=medium, 18=hard, 7=inter, 8=wet
   */
  visualTyreCompound: number;
  tyresAgeLaps: number;

  /** -1 = unknown, 0 = none, 1 = green, 2 = blue, 3 = yellow */
  vehicleFiaFlags: number;

  /** ICE power (W) */
  enginePowerICE: number;

  /** MGU-K power (W) */
  enginePowerMGUK: number;

  /** ERS energy (J) */
  ersStoreEnergy: number;

  /** 0 = none, 1 = medium, 2 = hotlap, 3 = overtake */
  ersDeployMode: number;
  ersHarvestedThisLapMGUK: number;
  ersHarvestedThisLapMGUH: number;
  ersDeployedThisLap: number;
  networkPaused: number;
}

export interface PacketCarStatusData {
  header: PacketHeader;
  carStatusData: CarStatusData[];
}
