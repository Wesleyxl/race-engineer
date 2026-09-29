/**
 * title: "Parse PacketHeader + peekPacketId"
 * description: "Reads the first 29 bytes. peekPacketId looks only at the type byte without parsing the rest — the adapter uses this in the switch."
 */

import { Buffer } from "buffer";

import type { PacketHeader } from '../packets/header';
import { PACKET_HEADER_SIZE } from '../constants';
import { BufferReader } from './buffer-reader';

export function parsePacketHeader(buffer: Buffer, offset = 0): PacketHeader {
  if (buffer.length - offset < PACKET_HEADER_SIZE) {
    throw new Error(
      `Buffer curto demais para PacketHeader: ${buffer.length - offset} < ${PACKET_HEADER_SIZE}`,
    );
  }

  const reader = new BufferReader(Buffer.from(buffer.subarray(offset)));

  return {
    packetFormat: reader.uint16(),
    gameYear: reader.uint8(),
    gameMajorVersion: reader.uint8(),
    gameMinorVersion: reader.uint8(),
    packetVersion: reader.uint8(),
    packetId: reader.uint8(),
    sessionUID: reader.uint64(),
    sessionTime: reader.float(),
    frameIdentifier: reader.uint32(),
    overallFrameIdentifier: reader.uint32(),
    playerCarIndex: reader.uint8(),
    secondaryPlayerCarIndex: reader.uint8(),
  };
}

/** Lê só o packetId sem parsear o header inteiro (offset 6 após format+year+versions) */
export function peekPacketId(buffer: Buffer): number {
  if (buffer.length < 7) {
    throw new Error('Buffer curto demais para ler packetId');
  }
  // uint16 format + uint8 year + major + minor + version + packetId
  return buffer.readUInt8(6);
}
