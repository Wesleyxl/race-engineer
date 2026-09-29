/**
 * title: "Parse binary Packet Lap Data"
 * description: "Unpacks array of 22 cars with times, position, driverStatus. Feeds isOnTrack and position to the adapter."
 */

import type { LapData, PacketLapData } from '../packets/lap-data';
import { MAX_NUM_CARS, PACKET_HEADER_SIZE, PACKET_SIZE } from '../constants';
import { BufferReader } from './buffer-reader';
import { parsePacketHeader } from './header';

function parseLapData(reader: BufferReader): LapData {
  return {
    lastLapTimeInMS: reader.uint32(),
    currentLapTimeInMS: reader.uint32(),
    sector1TimeMSPart: reader.uint16(),
    sector1TimeMinutesPart: reader.uint8(),
    sector2TimeMSPart: reader.uint16(),
    sector2TimeMinutesPart: reader.uint8(),
    deltaToCarInFrontMSPart: reader.uint16(),
    deltaToCarInFrontMinutesPart: reader.uint8(),
    deltaToRaceLeaderMSPart: reader.uint16(),
    deltaToRaceLeaderMinutesPart: reader.uint8(),
    lapDistance: reader.float(),
    totalDistance: reader.float(),
    safetyCarDelta: reader.float(),
    carPosition: reader.uint8(),
    currentLapNum: reader.uint8(),
    pitStatus: reader.uint8(),
    numPitStops: reader.uint8(),
    sector: reader.uint8(),
    currentLapInvalid: reader.uint8(),
    penalties: reader.uint8(),
    totalWarnings: reader.uint8(),
    cornerCuttingWarnings: reader.uint8(),
    numUnservedDriveThroughPens: reader.uint8(),
    numUnservedStopGoPens: reader.uint8(),
    gridPosition: reader.uint8(),
    driverStatus: reader.uint8(),
    resultStatus: reader.uint8(),
    pitLaneTimerActive: reader.uint8(),
    pitLaneTimeInLaneInMS: reader.uint16(),
    pitStopTimerInMS: reader.uint16(),
    pitStopShouldServePen: reader.uint8(),
    speedTrapFastestSpeed: reader.float(),
    speedTrapFastestLap: reader.uint8(),
  };
}

export function parseLapDataPacket(buffer: Buffer): PacketLapData {
  if (buffer.length < PACKET_SIZE.LapData) {
    throw new Error(
      `Buffer curto demais para LapData packet: ${buffer.length} < ${PACKET_SIZE.LapData}`,
    );
  }

  const header = parsePacketHeader(buffer);
  const reader = new BufferReader(buffer.subarray(PACKET_HEADER_SIZE));

  const lapData = reader.array(MAX_NUM_CARS, () => parseLapData(reader));
  const timeTrialPBCarIdx = reader.uint8();
  const timeTrialRivalCarIdx = reader.uint8();

  return {
    header,
    lapData,
    timeTrialPBCarIdx,
    timeTrialRivalCarIdx,
  };
}
