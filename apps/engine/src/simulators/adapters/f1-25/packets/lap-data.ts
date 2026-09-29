/**
 * Lap Data Packet
 * Frequency: rate of the menu | Size: 1285 bytes | Version: 1 | PacketId: 2
 */

import type { PacketHeader } from './header';

export interface LapData {
  /** Last lap in ms */
  lastLapTimeInMS: number;
  /** Current lap time in ms */
  currentLapTimeInMS: number;
  sector1TimeMSPart: number;
  sector1TimeMinutesPart: number;
  sector2TimeMSPart: number;
  sector2TimeMinutesPart: number;
  deltaToCarInFrontMSPart: number;
  deltaToCarInFrontMinutesPart: number;
  deltaToRaceLeaderMSPart: number;
  deltaToRaceLeaderMinutesPart: number;
  /** Current lap distance (m); can be negative before the line */
  lapDistance: number;
  /** Total distance in the session (m) */
  totalDistance: number;
  /** Safety car delta in seconds */
  safetyCarDelta: number;
  carPosition: number;
  currentLapNum: number;
  /** 0 = none, 1 = pitting, 2 = in pit area */
  pitStatus: number;
  numPitStops: number;
  /** 0 = sector1, 1 = sector2, 2 = sector3 */
  sector: number;
  /** 0 = valid, 1 = invalid */
  currentLapInvalid: number;
  /** Accumulated time penalties (seconds) */
  penalties: number;
  totalWarnings: number;
  cornerCuttingWarnings: number;
  numUnservedDriveThroughPens: number;
  numUnservedStopGoPens: number;
  gridPosition: number;
  /** 0 = garage, 1 = flying lap, 2 = in lap, 3 = out lap, 4 = on track */
  driverStatus: number;
  /**
   * 0 = invalid, 1 = inactive, 2 = active, 3 = finished,
   * 4 = DNF, 5 = DSQ, 6 = not classified, 7 = retired
   */
  resultStatus: number;
  /** 0 = inactive, 1 = active */
  pitLaneTimerActive: number;
  pitLaneTimeInLaneInMS: number;
  pitStopTimerInMS: number;
  pitStopShouldServePen: number;
  /** Fastest speed in the speed trap (km/h) */
  speedTrapFastestSpeed: number;
  /** Fastest lap speed; 255 = not defined */
  speedTrapFastestLap: number;
}

export interface PacketLapData {
  header: PacketHeader;
  lapData: LapData[];
  /** Index of the PB in time trial (255 if invalid) */
  timeTrialPBCarIdx: number;
  /** Index of the rival in time trial (255 if invalid) */
  timeTrialRivalCarIdx: number;
}
