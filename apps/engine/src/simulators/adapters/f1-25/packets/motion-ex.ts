/**
 * Motion Ex Packet
 * Frequency: rate of the menu | Size: 273 bytes | Version: 1 | PacketId: 13
 *
 * Extended data only for the player's car (motion platforms).
 * Tyre arrays [4]: RL, RR, FL, FR.
 */

import type { PacketHeader } from './header';

export interface PacketMotionExData {
  header: PacketHeader;
  suspensionPosition: number[];
  suspensionVelocity: number[];
  suspensionAcceleration: number[];
  wheelSpeed: number[];
  wheelSlipRatio: number[];
  wheelSlipAngle: number[];
  wheelLatForce: number[];
  wheelLongForce: number[];
  heightOfCOGAboveGround: number;
  localVelocityX: number;
  localVelocityY: number;
  localVelocityZ: number;
  angularVelocityX: number;
  angularVelocityY: number;
  angularVelocityZ: number;
  angularAccelerationX: number;
  angularAccelerationY: number;
  angularAccelerationZ: number;
  /** Front wheels angle (radians) */
  frontWheelsAngle: number;
  wheelVertForce: number[];
  /** Front plank height */
  frontAeroHeight: number;
  rearAeroHeight: number;
  frontRollAngle: number;
  rearRollAngle: number;
  /** Yaw of the chassis relative to the movement direction (rad) */
  chassisYaw: number;
  chassisPitch: number;
  /** Camber of each wheel (rad) */
  wheelCamber: number[];
  /** Difference between active and dynamic camber (rad) */
  wheelCamberGain: number[];
}
