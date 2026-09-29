/**
 * title: "Constants of the UDP F1 25 protocol"
 * description: "PacketId 0–15, official sizes, header 29 bytes, format 2025, 22 cars, wheel index RL/RR/FL/FR. Source: Data Output from F1 25 v3. SIMULATOR_ID = f1-25."
 */

export const PacketId = {
  Motion: 0,
  Session: 1,
  LapData: 2,
  Event: 3,
  Participants: 4,
  CarSetups: 5,
  CarTelemetry: 6,
  CarStatus: 7,
  FinalClassification: 8,
  LobbyInfo: 9,
  CarDamage: 10,
  SessionHistory: 11,
  TyreSets: 12,
  MotionEx: 13,
  TimeTrial: 14,
  LapPositions: 15,
} as const;

export type PacketId = (typeof PacketId)[keyof typeof PacketId];

export const PACKET_ID_NAME: Record<PacketId, string> = {
  [PacketId.Motion]: 'Motion',
  [PacketId.Session]: 'Session',
  [PacketId.LapData]: 'LapData',
  [PacketId.Event]: 'Event',
  [PacketId.Participants]: 'Participants',
  [PacketId.CarSetups]: 'CarSetups',
  [PacketId.CarTelemetry]: 'CarTelemetry',
  [PacketId.CarStatus]: 'CarStatus',
  [PacketId.FinalClassification]: 'FinalClassification',
  [PacketId.LobbyInfo]: 'LobbyInfo',
  [PacketId.CarDamage]: 'CarDamage',
  [PacketId.SessionHistory]: 'SessionHistory',
  [PacketId.TyreSets]: 'TyreSets',
  [PacketId.MotionEx]: 'MotionEx',
  [PacketId.TimeTrial]: 'TimeTrial',
  [PacketId.LapPositions]: 'LapPositions',
};

export const MAX_NUM_CARS = 22;
export const PACKET_HEADER_SIZE = 29;
export const PACKET_FORMAT = 2025;

export const PACKET_SIZE = {
  Motion: 1349,
  Session: 753,
  LapData: 1285,
  Event: 45,
  Participants: 1284,
  CarSetups: 1133,
  CarTelemetry: 1352,
  CarStatus: 1239,
  FinalClassification: 1042,
  LobbyInfo: 954,
  CarDamage: 1041,
  SessionHistory: 1460,
  TyreSets: 231,
  MotionEx: 273,
  TimeTrial: 101,
  LapPositions: 1131,
} as const;

export const WheelIndex = {
  RearLeft: 0,
  RearRight: 1,
  FrontLeft: 2,
  FrontRight: 3,
} as const;

export const SIMULATOR_ID = 'f1-25' as const;
