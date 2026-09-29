/**
 * title: "Parse binary Packet Car Status"
 * description: "Unpacks fuel, ERS, flags, pit limiter, compound. Goes to the status block of the TelemetryModel."
 */

import type { CarStatusData, PacketCarStatusData } from '../packets/car-status';
import { MAX_NUM_CARS, PACKET_HEADER_SIZE, PACKET_SIZE } from '../constants';
import { BufferReader } from './buffer-reader';
import { parsePacketHeader } from './header';

function parseCarStatus(reader: BufferReader): CarStatusData {
  return {
    tractionControl: reader.uint8(),
    antiLockBrakes: reader.uint8(),
    fuelMix: reader.uint8(),
    frontBrakeBias: reader.uint8(),
    pitLimiterStatus: reader.uint8(),
    fuelInTank: reader.float(),
    fuelCapacity: reader.float(),
    fuelRemainingLaps: reader.float(),
    maxRPM: reader.uint16(),
    idleRPM: reader.uint16(),
    maxGears: reader.uint8(),
    drsAllowed: reader.uint8(),
    drsActivationDistance: reader.uint16(),
    actualTyreCompound: reader.uint8(),
    visualTyreCompound: reader.uint8(),
    tyresAgeLaps: reader.uint8(),
    vehicleFiaFlags: reader.int8(),
    enginePowerICE: reader.float(),
    enginePowerMGUK: reader.float(),
    ersStoreEnergy: reader.float(),
    ersDeployMode: reader.uint8(),
    ersHarvestedThisLapMGUK: reader.float(),
    ersHarvestedThisLapMGUH: reader.float(),
    ersDeployedThisLap: reader.float(),
    networkPaused: reader.uint8(),
  };
}

export function parseCarStatusPacket(buffer: Buffer): PacketCarStatusData {
  if (buffer.length < PACKET_SIZE.CarStatus) {
    throw new Error(
      `Buffer curto demais para CarStatus packet: ${buffer.length} < ${PACKET_SIZE.CarStatus}`,
    );
  }

  const header = parsePacketHeader(buffer);
  const reader = new BufferReader(buffer.subarray(PACKET_HEADER_SIZE));

  return {
    header,
    carStatusData: reader.array(MAX_NUM_CARS, () => parseCarStatus(reader)),
  };
}
