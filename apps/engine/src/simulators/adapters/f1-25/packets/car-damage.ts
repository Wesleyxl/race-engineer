/**
 * Car Damage Packet
 * Frequency: 10/s | Size: 1041 bytes | Version: 1 | PacketId: 10
 *
 * Arrays de roda [4]: RL, RR, FL, FR.
 */

import { PacketHeader } from "./header";

export interface CarDamageData {
  /** Tyre wear (%) */
  tyresWear: number[];
  tyresDamage: number[];
  brakesDamage: number[];

  /** Blisters (%) */
  tyreBlisters: number[];
  frontLeftWingDamage: number;
  frontRightWingDamage: number;
  rearWingDamage: number;
  floorDamage: number;
  diffuserDamage: number;
  sidepodDamage: number;

  /** 0 = OK, 1 = fault */
  drsFault: number;
  ersFault: number;
  gearBoxDamage: number;
  engineDamage: number;
  engineMGUHWear: number;
  engineESWear: number;
  engineCEWear: number;
  engineICEWear: number;
  engineMGUKWear: number;
  engineTCWear: number;

  /** 0 = OK, 1 = fault */
  engineBlown: number;
  engineSeized: number;
}

export interface PacketCarDamageData {
  header: PacketHeader;
  carDamageData: CarDamageData[];
}
