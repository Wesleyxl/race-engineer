/**
 * title: "Reexport interfaces of all PacketId. No parsing — only TypeScript types of the protocol."
 */

export type { PacketHeader } from './header';
export type { CarMotionData, PacketMotionData } from './motion';
export type {
  MarshalZone,
  WeatherForecastSample,
  PacketSessionData,
} from './session';
export type { LapData, PacketLapData } from './lap-data';
export {
  EventCode,
  type EventDataDetails,
  type PacketEventData,
  type FastestLapEvent,
  type RetirementEvent,
  type DrsDisabledEvent,
  type TeamMateInPitsEvent,
  type RaceWinnerEvent,
  type PenaltyEvent,
  type SpeedTrapEvent,
  type StartLightsEvent,
  type DriveThroughPenaltyServedEvent,
  type StopGoPenaltyServedEvent,
  type FlashbackEvent,
  type ButtonsEvent,
  type OvertakeEvent,
  type SafetyCarEvent,
  type CollisionEvent,
} from './event';
export type {
  LiveryColour,
  ParticipantData,
  PacketParticipantsData,
} from './participants';
export type { CarSetupData, PacketCarSetupData } from './car-setups';
export type { CarTelemetryData, PacketCarTelemetryData } from './car-telemetry';
export type { CarStatusData, PacketCarStatusData } from './car-status';
export type {
  FinalClassificationData,
  PacketFinalClassificationData,
} from './final-classification';
export type { LobbyInfoData, PacketLobbyInfoData } from './lobby-info';
export type { CarDamageData, PacketCarDamageData } from './car-damage';
export type {
  LapHistoryData,
  TyreStintHistoryData,
  PacketSessionHistoryData,
} from './session-history';
export type { TyreSetData, PacketTyreSetsData } from './tyre-sets';
export type { PacketMotionExData } from './motion-ex';
export type { TimeTrialDataSet, PacketTimeTrialData } from './time-trial';
export type { PacketLapPositionsData } from './lap-positions';
