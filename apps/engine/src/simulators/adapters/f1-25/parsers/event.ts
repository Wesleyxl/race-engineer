/**
 * title: "Parse binary Packet Event"
 * description: "Reads eventStringCode. Implements details of STLG (numLights) and LGOT; other events have empty details for now."
 */

import type { PacketEventData } from '../packets/event';
import { EventCode } from '../packets/event';
import { PACKET_HEADER_SIZE, PACKET_SIZE } from '../constants';
import { BufferReader } from './buffer-reader';
import { parsePacketHeader } from './header';

/**
 * Parser do pacote Event (PacketId = 3).
 *
 * For GetReady we only need:
 *   STLG (StartLights) → numLights (1..5)
 *   LGOT (LightsOut)   → start (turn off the lights)
 *
 * Other eventCodes are read, but details are empty for now.
 */
export function parseEventPacket(buffer: Buffer): PacketEventData {
  if (buffer.length < PACKET_SIZE.Event) {
    throw new Error(
      `Buffer curto demais para Event packet: ${buffer.length} < ${PACKET_SIZE.Event}`,
    );
  }

  const header = parsePacketHeader(buffer);
  const reader = new BufferReader(buffer.subarray(PACKET_HEADER_SIZE));

  const eventStringCode = reader.chars(4);

  let eventDetails: PacketEventData['eventDetails'] = {};

  if (eventStringCode === EventCode.StartLights) {
    // uint8 numLights
    eventDetails = { numLights: reader.uint8() };
  }
  // LightsOut não tem payload — só o código LGOT

  return {
    header,
    eventStringCode,
    eventDetails,
  };
}
