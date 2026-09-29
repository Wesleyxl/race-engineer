/**
 * title: "Parse binary Packet Motion"
 * description: "Unpacks position/velocity/orientation/G of all cars. Adapter uses only the player's index."
 */

import type { CarMotionData, PacketMotionData } from '../packets/motion';
import { MAX_NUM_CARS, PACKET_HEADER_SIZE, PACKET_SIZE } from '../constants';
import { BufferReader } from './buffer-reader';
import { parsePacketHeader } from './header';

function parseCarMotion(reader: BufferReader): CarMotionData {
  return {
    worldPositionX: reader.float(),
    worldPositionY: reader.float(),
    worldPositionZ: reader.float(),
    worldVelocityX: reader.float(),
    worldVelocityY: reader.float(),
    worldVelocityZ: reader.float(),
    worldForwardDirX: reader.int16(),
    worldForwardDirY: reader.int16(),
    worldForwardDirZ: reader.int16(),
    worldRightDirX: reader.int16(),
    worldRightDirY: reader.int16(),
    worldRightDirZ: reader.int16(),
    gForceLateral: reader.float(),
    gForceLongitudinal: reader.float(),
    gForceVertical: reader.float(),
    yaw: reader.float(),
    pitch: reader.float(),
    roll: reader.float(),
  };
}

export function parseMotionPacket(buffer: Buffer): PacketMotionData {
  if (buffer.length < PACKET_SIZE.Motion) {
    throw new Error(
      `Buffer curto demais para Motion packet: ${buffer.length} < ${PACKET_SIZE.Motion}`,
    );
  }

  const header = parsePacketHeader(buffer);
  const reader = new BufferReader(buffer.subarray(PACKET_HEADER_SIZE));

  return {
    header,
    carMotionData: reader.array(MAX_NUM_CARS, () => parseCarMotion(reader)),
  };
}
