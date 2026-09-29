/**
 * title: "Parse binary Packet Session"
 * description: "Unpacks weather, temps, session type, marshal zones and forecast for PacketSessionData."
 */

import type {
  MarshalZone,
  PacketSessionData,
  WeatherForecastSample,
} from '../packets/session';
import { PACKET_HEADER_SIZE, PACKET_SIZE } from '../constants';
import { BufferReader } from './buffer-reader';
import { parsePacketHeader } from './header';

const MAX_MARSHAL_ZONES = 21;
const MAX_WEATHER_SAMPLES = 64;
const WEEKEND_STRUCTURE_SIZE = 12;

function parseMarshalZone(reader: BufferReader): MarshalZone {
  return {
    zoneStart: reader.float(),
    zoneFlag: reader.int8(),
  };
}

function parseWeatherForecastSample(
  reader: BufferReader,
): WeatherForecastSample {
  return {
    sessionType: reader.uint8(),
    timeOffset: reader.uint8(),
    weather: reader.uint8(),
    trackTemperature: reader.int8(),
    trackTemperatureChange: reader.int8(),
    airTemperature: reader.int8(),
    airTemperatureChange: reader.int8(),
    rainPercentage: reader.uint8(),
  };
}

export function parseSessionPacket(buffer: Buffer): PacketSessionData {
  if (buffer.length < PACKET_SIZE.Session) {
    throw new Error(
      `Buffer curto demais para Session packet: ${buffer.length} < ${PACKET_SIZE.Session}`,
    );
  }

  const header = parsePacketHeader(buffer);
  const reader = new BufferReader(buffer.subarray(PACKET_HEADER_SIZE));

  const weather = reader.uint8();
  const trackTemperature = reader.int8();
  const airTemperature = reader.int8();
  const totalLaps = reader.uint8();
  const trackLength = reader.uint16();
  const sessionType = reader.uint8();
  const trackId = reader.int8();
  const formula = reader.uint8();
  const sessionTimeLeft = reader.uint16();
  const sessionDuration = reader.uint16();
  const pitSpeedLimit = reader.uint8();
  const gamePaused = reader.uint8();
  const isSpectating = reader.uint8();
  const spectatorCarIndex = reader.uint8();
  const sliProNativeSupport = reader.uint8();
  const numMarshalZones = reader.uint8();
  const marshalZonesAll = reader.array(MAX_MARSHAL_ZONES, () =>
    parseMarshalZone(reader),
  );
  const safetyCarStatus = reader.uint8();
  const networkGame = reader.uint8();
  const numWeatherForecastSamples = reader.uint8();
  const weatherForecastSamplesAll = reader.array(MAX_WEATHER_SAMPLES, () =>
    parseWeatherForecastSample(reader),
  );
  const forecastAccuracy = reader.uint8();
  const aiDifficulty = reader.uint8();
  const seasonLinkIdentifier = reader.uint32();
  const weekendLinkIdentifier = reader.uint32();
  const sessionLinkIdentifier = reader.uint32();
  const pitStopWindowIdealLap = reader.uint8();
  const pitStopWindowLatestLap = reader.uint8();
  const pitStopRejoinPosition = reader.uint8();
  const steeringAssist = reader.uint8();
  const brakingAssist = reader.uint8();
  const gearboxAssist = reader.uint8();
  const pitAssist = reader.uint8();
  const pitReleaseAssist = reader.uint8();
  const ersAssist = reader.uint8();
  const drsAssist = reader.uint8();
  const dynamicRacingLine = reader.uint8();
  const dynamicRacingLineType = reader.uint8();
  const gameMode = reader.uint8();
  const ruleSet = reader.uint8();
  const timeOfDay = reader.uint32();
  const sessionLength = reader.uint8();
  const speedUnitsLeadPlayer = reader.uint8();
  const temperatureUnitsLeadPlayer = reader.uint8();
  const speedUnitsSecondaryPlayer = reader.uint8();
  const temperatureUnitsSecondaryPlayer = reader.uint8();
  const numSafetyCarPeriods = reader.uint8();
  const numVirtualSafetyCarPeriods = reader.uint8();
  const numRedFlagPeriods = reader.uint8();
  const equalCarPerformance = reader.uint8();
  const recoveryMode = reader.uint8();
  const flashbackLimit = reader.uint8();
  const surfaceType = reader.uint8();
  const lowFuelMode = reader.uint8();
  const raceStarts = reader.uint8();
  const tyreTemperature = reader.uint8();
  const pitLaneTyreSim = reader.uint8();
  const carDamage = reader.uint8();
  const carDamageRate = reader.uint8();
  const collisions = reader.uint8();
  const collisionsOffForFirstLapOnly = reader.uint8();
  const mpUnsafePitRelease = reader.uint8();
  const mpOffForGriefing = reader.uint8();
  const cornerCuttingStringency = reader.uint8();
  const parcFermeRules = reader.uint8();
  const pitStopExperience = reader.uint8();
  const safetyCar = reader.uint8();
  const safetyCarExperience = reader.uint8();
  const formationLap = reader.uint8();
  const formationLapExperience = reader.uint8();
  const redFlags = reader.uint8();
  const affectsLicenceLevelSolo = reader.uint8();
  const affectsLicenceLevelMP = reader.uint8();
  const numSessionsInWeekend = reader.uint8();
  const weekendStructureAll = reader.array(WEEKEND_STRUCTURE_SIZE, () =>
    reader.uint8(),
  );
  const sector2LapDistanceStart = reader.float();
  const sector3LapDistanceStart = reader.float();

  return {
    header,
    weather,
    trackTemperature,
    airTemperature,
    totalLaps,
    trackLength,
    sessionType,
    trackId,
    formula,
    sessionTimeLeft,
    sessionDuration,
    pitSpeedLimit,
    gamePaused,
    isSpectating,
    spectatorCarIndex,
    sliProNativeSupport,
    numMarshalZones,
    marshalZones: marshalZonesAll.slice(0, numMarshalZones),
    safetyCarStatus,
    networkGame,
    numWeatherForecastSamples,
    weatherForecastSamples: weatherForecastSamplesAll.slice(
      0,
      numWeatherForecastSamples,
    ),
    forecastAccuracy,
    aiDifficulty,
    seasonLinkIdentifier,
    weekendLinkIdentifier,
    sessionLinkIdentifier,
    pitStopWindowIdealLap,
    pitStopWindowLatestLap,
    pitStopRejoinPosition,
    steeringAssist,
    brakingAssist,
    gearboxAssist,
    pitAssist,
    pitReleaseAssist,
    ersAssist,
    drsAssist,
    dynamicRacingLine,
    dynamicRacingLineType,
    gameMode,
    ruleSet,
    timeOfDay,
    sessionLength,
    speedUnitsLeadPlayer,
    temperatureUnitsLeadPlayer,
    speedUnitsSecondaryPlayer,
    temperatureUnitsSecondaryPlayer,
    numSafetyCarPeriods,
    numVirtualSafetyCarPeriods,
    numRedFlagPeriods,
    equalCarPerformance,
    recoveryMode,
    flashbackLimit,
    surfaceType,
    lowFuelMode,
    raceStarts,
    tyreTemperature,
    pitLaneTyreSim,
    carDamage,
    carDamageRate,
    collisions,
    collisionsOffForFirstLapOnly,
    mpUnsafePitRelease,
    mpOffForGriefing,
    cornerCuttingStringency,
    parcFermeRules,
    pitStopExperience,
    safetyCar,
    safetyCarExperience,
    formationLap,
    formationLapExperience,
    redFlags,
    affectsLicenceLevelSolo,
    affectsLicenceLevelMP,
    numSessionsInWeekend,
    weekendStructure: weekendStructureAll.slice(0, numSessionsInWeekend),
    sector2LapDistanceStart,
    sector3LapDistanceStart,
  };
}
