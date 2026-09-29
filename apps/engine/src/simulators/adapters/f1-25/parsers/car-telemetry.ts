/**
 * title: "Parse binary Packet Car Telemetry"
 * description: "Unpacks speed/inputs/RPM/DRS/tyre temps of all cars. It is the packet that unlocks the snapshot in the adapter."
 */

import type { CarTelemetryData, PacketCarTelemetryData } from '../packets/car-telemetry';
import { MAX_NUM_CARS, PACKET_HEADER_SIZE, PACKET_SIZE } from '../constants';
import { BufferReader } from './buffer-reader';
import { parsePacketHeader } from './header';

function parseCarTelemetry(reader: BufferReader): CarTelemetryData {
  return {
    speed: reader.uint16(),
    throttle: reader.float(),
    steer: reader.float(),
    brake: reader.float(),
    clutch: reader.uint8(),
    gear: reader.int8(),
    engineRPM: reader.uint16(),
    drs: reader.uint8(),
    revLightsPercent: reader.uint8(),
    revLightsBitValue: reader.uint16(),
    brakesTemperature: reader.array(4, () => reader.uint16()),
    tyresSurfaceTemperature: reader.array(4, () => reader.uint8()),
    tyresInnerTemperature: reader.array(4, () => reader.uint8()),
    engineTemperature: reader.uint16(),
    tyresPressure: reader.array(4, () => reader.float()),
    surfaceType: reader.array(4, () => reader.uint8()),
  };
}

export function parseCarTelemetryPacket(buffer: Buffer): PacketCarTelemetryData {
  if (buffer.length < PACKET_SIZE.CarTelemetry) {
    throw new Error(
      `Buffer curto demais para CarTelemetry packet: ${buffer.length} < ${PACKET_SIZE.CarTelemetry}`,
    );
  }

  const header = parsePacketHeader(buffer);
  const reader = new BufferReader(buffer.subarray(PACKET_HEADER_SIZE));

  return {
    header,
    carTelemetryData: reader.array(MAX_NUM_CARS, () => parseCarTelemetry(reader)),
    mfdPanelIndex: reader.uint8(),
    mfdPanelIndexSecondaryPlayer: reader.uint8(),
    suggestedGear: reader.int8(),
  };
}
