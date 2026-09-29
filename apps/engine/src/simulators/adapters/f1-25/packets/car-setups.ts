/**
 * Car Setups Packet
 * Frequency: 2/s | Size: 1133 bytes | Version: 1 | PacketId: 5
 *
 * In MP, other players appear blank — only the own setup is visible.
 */

import type { PacketHeader } from './header';

export interface CarSetupData {
  frontWing: number;
  rearWing: number;
  /** Differential on throttle (%) */
  onThrottle: number;

  /** Differential off throttle (%) */
  offThrottle: number;
  frontCamber: number;
  rearCamber: number;
  frontToe: number;
  rearToe: number;
  frontSuspension: number;
  rearSuspension: number;
  frontAntiRollBar: number;
  rearAntiRollBar: number;
  frontSuspensionHeight: number;
  rearSuspensionHeight: number;

  /** Brake pressure (%) */
  brakePressure: number;
  /** Brake bias (%) */

  brakeBias: number;
  /** Engine braking (%) */
  engineBraking: number;
  rearLeftTyrePressure: number;
  rearRightTyrePressure: number;
  frontLeftTyrePressure: number;
  frontRightTyrePressure: number;
  ballast: number;
  fuelLoad: number;
}

export interface PacketCarSetupData {
  header: PacketHeader;
  carSetups: CarSetupData[];

  /** Front wing after the next pit — only player */
  nextFrontWingValue: number;
}
