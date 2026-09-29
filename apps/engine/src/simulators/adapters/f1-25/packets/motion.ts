/**
 * title: "Type PacketId 0 — Motion"
 * description: "Physics of all cars: position/velocity in world, orientation, G-forces. The adapter uses the player's car for worldPosition and yaw/pitch/roll."
 */

/**
 * Frequency: rate of the menu | Size: 273 bytes | Version: 1 | PacketId: 13
 * Frequency: rate do menu | Size: 1349 bytes | Version: 1 | PacketId: 0
 *
 * Physics of all cars: position/velocity in world, orientation, G-forces.
 * Normalized vectors (int16): divide by 32767.0 to get float (-1..1).
 */

import type { PacketHeader } from './header';

export interface CarMotionData {
  /** Posição X no world space (metros) */
  worldPositionX: number;
  worldPositionY: number;
  worldPositionZ: number;
  /** Velocity in world space (m/s) */
  worldVelocityX: number;
  worldVelocityY: number;
  worldVelocityZ: number;
  /** Forward direction normalized (int16) */
  worldForwardDirX: number;
  worldForwardDirY: number;
  worldForwardDirZ: number;
  /** Right direction normalized (int16) */
  worldRightDirX: number;
  worldRightDirY: number;
  worldRightDirZ: number;
  gForceLateral: number;
  gForceLongitudinal: number;
  gForceVertical: number;
  /** Yaw in radians */
  yaw: number;
  pitch: number;
  roll: number;
}

export interface PacketMotionData {
  header: PacketHeader;
  /** Motion data for all cars on the track (max 22) */
  carMotionData: CarMotionData[];
}
