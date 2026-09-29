/**
 * title: "Parse binary Packet Car Damage"
 * description: "Unpacks wear/damage by part and by tyre. Adapter copies to tyreWear and damage."
 */


import type { CarDamageData, PacketCarDamageData } from '../packets/car-damage';
import { MAX_NUM_CARS, PACKET_HEADER_SIZE, PACKET_SIZE } from '../constants';
import { BufferReader } from './buffer-reader';
import { parsePacketHeader } from './header';

function parseCarDamage(reader: BufferReader): CarDamageData {
  return {
    tyresWear: reader.array(4, () => reader.float()),
    tyresDamage: reader.array(4, () => reader.uint8()),
    brakesDamage: reader.array(4, () => reader.uint8()),
    tyreBlisters: reader.array(4, () => reader.uint8()),
    frontLeftWingDamage: reader.uint8(),
    frontRightWingDamage: reader.uint8(),
    rearWingDamage: reader.uint8(),
    floorDamage: reader.uint8(),
    diffuserDamage: reader.uint8(),
    sidepodDamage: reader.uint8(),
    drsFault: reader.uint8(),
    ersFault: reader.uint8(),
    gearBoxDamage: reader.uint8(),
    engineDamage: reader.uint8(),
    engineMGUHWear: reader.uint8(),
    engineESWear: reader.uint8(),
    engineCEWear: reader.uint8(),
    engineICEWear: reader.uint8(),
    engineMGUKWear: reader.uint8(),
    engineTCWear: reader.uint8(),
    engineBlown: reader.uint8(),
    engineSeized: reader.uint8(),
  };
}

export function parseCarDamagePacket(buffer: Buffer): PacketCarDamageData {
  if (buffer.length < PACKET_SIZE.CarDamage) {
    throw new Error(
      `Buffer curto demais para CarDamage packet: ${buffer.length} < ${PACKET_SIZE.CarDamage}`,
    );
  }

  const header = parsePacketHeader(buffer);
  const reader = new BufferReader(buffer.subarray(PACKET_HEADER_SIZE));

  return {
    header,
    carDamageData: reader.array(MAX_NUM_CARS, () => parseCarDamage(reader)),
  };
}
