/**
 * Session Packet
 * Frequency: 2/s | Size: 753 bytes | Version: 1 | PacketId: 1
 *
 * Details of the ongoing session.
 */

import type { PacketHeader } from './header';

export interface MarshalZone {
  /** Fraction (0..1) of the lap where the zone starts */
  zoneStart: number;
  /** -1 = invalid/unknown, 0 = none, 1 = green, 2 = blue, 3 = yellow */
  zoneFlag: number;
}

export interface WeatherForecastSample {
  /** 0 = unknown, ver appendix */
  sessionType: number;
  /** Minutes until the forecast */
  timeOffset: number;
  /** 0 = clear, 1 = light cloud, 2 = overcast, 3 = light rain, 4 = heavy rain, 5 = storm */
  weather: number;
  /** Track temperature (°C) */
  trackTemperature: number;
  /** 0 = up, 1 = down, 2 = no change */
  trackTemperatureChange: number;
  /** Air temperature (°C) */
  airTemperature: number;
  /** 0 = up, 1 = down, 2 = no change */
  airTemperatureChange: number;
  /** Chance of rain 0–100 */
  rainPercentage: number;
}

export interface PacketSessionData {
  header: PacketHeader;
  /** 0 = clear … 5 = storm */
  weather: number;
  trackTemperature: number;
  airTemperature: number;
  totalLaps: number;
  /** Track length in meters */
  trackLength: number;
  /** 0 = unknown, ver appendix */
  sessionType: number;
  /** -1 = unknown, ver appendix */
  trackId: number;
  /**
   * 0 = F1 Modern, 1 = F1 Classic, 2 = F2, 3 = F1 Generic,
   * 4 = Beta, 6 = Esports, 8 = F1 World, 9 = F1 Elimination
   */
  formula: number;
  /** Remaining session time (seconds) */
  sessionTimeLeft: number;
  /** Duração da sessão (segundos) */
  sessionDuration: number;
  /** Pit speed limit (km/h) */
  pitSpeedLimit: number;
  /** Game paused — only network */
  gamePaused: number;
  isSpectating: number;
  spectatorCarIndex: number;
  /** 0 = inactive, 1 = active */
  sliProNativeSupport: number;
  numMarshalZones: number;
  /** Max 21 */
  marshalZones: MarshalZone[];
  /** 0 = none, 1 = full, 2 = virtual, 3 = formation lap */
  safetyCarStatus: number;
  /** 0 = offline, 1 = online */
  networkGame: number;
  numWeatherForecastSamples: number;
  /** Max 64 */
  weatherForecastSamples: WeatherForecastSample[];
  /** 0 = Perfect, 1 = Approximate */
  forecastAccuracy: number;
  /** AI difficulty 0–110 */
  aiDifficulty: number;
  seasonLinkIdentifier: number;
  weekendLinkIdentifier: number;
  sessionLinkIdentifier: number;
  pitStopWindowIdealLap: number;
  pitStopWindowLatestLap: number;
  pitStopRejoinPosition: number;
  /** 0 = off, 1 = on */
  steeringAssist: number;
  /** 0 = off, 1 = low, 2 = medium, 3 = high */
  brakingAssist: number;
  /** 1 = manual, 2 = manual + suggested, 3 = auto */
  gearboxAssist: number;
  pitAssist: number;
  pitReleaseAssist: number;
  ersAssist: number;
  drsAssist: number;
  /** 0 = off, 1 = corners only, 2 = full */
  dynamicRacingLine: number;
  /** 0 = 2D, 1 = 3D */
  dynamicRacingLineType: number;
  /** See appendix */
  gameMode: number;
  /** See appendix */
  ruleSet: number;
  /** Minutes since midnight */
  timeOfDay: number;
  /**
   * 0 = None, 2 = Very Short, 3 = Short, 4 = Medium,
   * 5 = Medium Long, 6 = Long, 7 = Full
   */
  sessionLength: number;
  /** 0 = MPH, 1 = KPH */
  speedUnitsLeadPlayer: number;
  /** 0 = Celsius, 1 = Fahrenheit */
  temperatureUnitsLeadPlayer: number;
  speedUnitsSecondaryPlayer: number;
  temperatureUnitsSecondaryPlayer: number;
  numSafetyCarPeriods: number;
  numVirtualSafetyCarPeriods: number;
  numRedFlagPeriods: number;
  equalCarPerformance: number;
  /** 0 = None, 1 = Flashbacks, 2 = Auto-recovery */
  recoveryMode: number;
  /** 0 = Low, 1 = Medium, 2 = High, 3 = Unlimited */
  flashbackLimit: number;
  /** 0 = Simplified, 1 = Realistic */
  surfaceType: number;
  /** 0 = Easy, 1 = Hard */
  lowFuelMode: number;
  /** 0 = Manual, 1 = Assisted */
  raceStarts: number;
  /** 0 = Surface only, 1 = Surface & Carcass */
  tyreTemperature: number;
  /** 0 = On, 1 = Off */
  pitLaneTyreSim: number;
  /** 0 = Off, 1 = Reduced, 2 = Standard, 3 = Simulation */
  carDamage: number;
  /** 0 = Reduced, 1 = Standard, 2 = Simulation */
  carDamageRate: number;
  /** 0 = Off, 1 = Player-to-Player Off, 2 = On */
  collisions: number;
  collisionsOffForFirstLapOnly: number;
  /** 0 = On, 1 = Off (MP) */
  mpUnsafePitRelease: number;
  /** 0 = Disabled, 1 = Enabled (MP) */
  mpOffForGriefing: number;
  /** 0 = Regular, 1 = Strict */
  cornerCuttingStringency: number;
  parcFermeRules: number;
  /** 0 = Automatic, 1 = Broadcast, 2 = Immersive */
  pitStopExperience: number;
  /** 0 = Off, 1 = Reduced, 2 = Standard, 3 = Increased */
  safetyCar: number;
  /** 0 = Broadcast, 1 = Immersive */
  safetyCarExperience: number;
  formationLap: number;
  /** 0 = Broadcast, 1 = Immersive */
  formationLapExperience: number;
  /** 0 = Off, 1 = Reduced, 2 = Standard, 3 = Increased */
  redFlags: number;
  affectsLicenceLevelSolo: number;
  affectsLicenceLevelMP: number;
  numSessionsInWeekend: number;
  /** Session types for the weekend — max 12, see appendix */
  weekendStructure: number[];
  /** Distance (m) where the sector 2 starts */
  sector2LapDistanceStart: number;
  /** Distance (m) where the sector 3 starts */
  sector3LapDistanceStart: number;
}
