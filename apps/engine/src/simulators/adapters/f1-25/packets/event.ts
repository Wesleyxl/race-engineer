/**
 * Event Packet
 * Frequency: when it occurs | Size: 45 bytes | Version: 1 | PacketId: 3
 *
 * m_eventDetails should be interpreted according to the eventStringCode.
 */

import type { PacketHeader } from './header';

export const EventCode = {
  SessionStarted: 'SSTA',
  SessionEnded: 'SEND',
  FastestLap: 'FTLP',
  Retirement: 'RTMT',
  DrsEnabled: 'DRSE',
  DrsDisabled: 'DRSD',
  TeamMateInPits: 'TMPT',
  ChequeredFlag: 'CHQF',
  RaceWinner: 'RCWN',
  PenaltyIssued: 'PENA',
  SpeedTrapTriggered: 'SPTP',
  StartLights: 'STLG',
  LightsOut: 'LGOT',
  DriveThroughServed: 'DTSV',
  StopGoServed: 'SGSV',
  Flashback: 'FLBK',
  ButtonStatus: 'BUTN',
  RedFlag: 'RDFL',
  Overtake: 'OVTK',
  SafetyCar: 'SCAR',
  Collision: 'COLL',
} as const;

export type EventCode = (typeof EventCode)[keyof typeof EventCode];

export interface FastestLapEvent {
  vehicleIdx: number;
  /** Lap time in seconds */
  lapTime: number;
}

export interface RetirementEvent {
  vehicleIdx: number;
  /**
   * 0 = invalid, 1 = retired, 2 = finished, 3 = terminal damage,
   * 4 = inactive, 5 = not enough laps, 6 = black flagged,
   * 7 = red flagged, 8 = mechanical failure, 9 = session skipped,
   * 10 = session simulated
   */
  reason: number;
}

export interface DrsDisabledEvent {
  /** 0 = Wet track, 1 = SC deployed, 2 = Red flag, 3 = Min lap not reached */
  reason: number;
}

export interface TeamMateInPitsEvent {
  vehicleIdx: number;
}

export interface RaceWinnerEvent {
  vehicleIdx: number;
}

export interface PenaltyEvent {
  /** Ver appendix */
  penaltyType: number;
  /** Ver appendix */
  infringementType: number;
  vehicleIdx: number;
  otherVehicleIdx: number;
  /** Time gained or lost in the action (seconds) */
  time: number;
  lapNum: number;
  placesGained: number;
}

export interface SpeedTrapEvent {
  vehicleIdx: number;
  /** km/h */
  speed: number;
  isOverallFastestInSession: number;
  isDriverFastestInSession: number;
  fastestVehicleIdxInSession: number;
  fastestSpeedInSession: number;
}

export interface StartLightsEvent {
  numLights: number;
}

export interface DriveThroughPenaltyServedEvent {
  vehicleIdx: number;
}

export interface StopGoPenaltyServedEvent {
  vehicleIdx: number;
  /** Time serving stop-go (seconds) */
  stopTime: number;
}

export interface FlashbackEvent {
  flashbackFrameIdentifier: number;
  flashbackSessionTime: number;
}

export interface ButtonsEvent {
  /** Bit flags — ver appendix */
  buttonStatus: number;
}

export interface OvertakeEvent {
  overtakingVehicleIdx: number;
  beingOvertakenVehicleIdx: number;
}

export interface SafetyCarEvent {
  /** 0 = none, 1 = full, 2 = VSC, 3 = formation */
  safetyCarType: number;
  /** 0 = Deployed, 1 = Returning, 2 = Returned, 3 = Resume Race */
  eventType: number;
}

export interface CollisionEvent {
  vehicle1Idx: number;
  vehicle2Idx: number;
}

export type EventDataDetails =
  | FastestLapEvent
  | RetirementEvent
  | DrsDisabledEvent
  | TeamMateInPitsEvent
  | RaceWinnerEvent
  | PenaltyEvent
  | SpeedTrapEvent
  | StartLightsEvent
  | DriveThroughPenaltyServedEvent
  | StopGoPenaltyServedEvent
  | FlashbackEvent
  | ButtonsEvent
  | OvertakeEvent
  | SafetyCarEvent
  | CollisionEvent
  | Record<string, never>;

export interface PacketEventData {
  header: PacketHeader;
  /** 4 chars, ex.: "FTLP", "SCAR" */
  eventStringCode: string;
  eventDetails: EventDataDetails;
}
