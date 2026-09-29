/**
 * Time Trial Packet
 * Frequency: 1/s | Size: 101 bytes | Version: 1 | PacketId: 14
 *
 * Only sent in Time Trial mode.
 */

import type { PacketHeader } from './header';

export interface TimeTrialDataSet {
  carIdx: number;
  teamId: number;
  lapTimeInMS: number;
  sector1TimeInMS: number;
  sector2TimeInMS: number;
  sector3TimeInMS: number;
  /** 0 = off, 1 = on */
  tractionControl: number;
  gearboxAssist: number;
  antiLockBrakes: number;
  /** 0 = Realistic, 1 = Equal */
  equalCarPerformance: number;
  /** 0 = No, 1 = Yes */
  customSetup: number;
  /** 0 = invalid, 1 = valid */
  valid: number;
}

export interface PacketTimeTrialData {
  header: PacketHeader;
  playerSessionBestDataSet: TimeTrialDataSet;
  personalBestDataSet: TimeTrialDataSet;
  rivalDataSet: TimeTrialDataSet;
}
