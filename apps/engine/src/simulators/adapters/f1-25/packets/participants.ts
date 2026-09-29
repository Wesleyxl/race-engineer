
/**
 * Participants Packet
 * Frequency: every 5 seconds | Size: 1284 bytes | Version: 1 | PacketId: 4
 */

import type { PacketHeader } from './header';

export interface LiveryColour {
  red: number;
  green: number;
  blue: number;
}

export interface ParticipantData {
  /** 1 = AI, 0 = Human */
  aiControlled: number;
  /** See appendix; 255 if network human */
  driverId: number;
  /** Unique ID for network players */
  networkId: number;
  /** See appendix */
  teamId: number;
  /** 1 = My Team */
  myTeam: number;
  raceNumber: number;
  nationality: number;
  /** UTF-8, null-terminated, max 32 */
  name: string;
  /** 0 = restricted, 1 = public */
  yourTelemetry: number;
  /** 0 = off, 1 = on */
  showOnlineNames: number;
  /** F1 World tech level */
  techLevel: number;
  /** 1 = Steam, 3 = PlayStation, 4 = Xbox, 6 = Origin, 255 = unknown */
  platform: number;
  numColours: number;
  /** Max 4 */
  liveryColours: LiveryColour[];
}

export interface PacketParticipantsData {
  header: PacketHeader;
  /** Number of active cars (should match the HUD) */
  numActiveCars: number;
  participants: ParticipantData[];
}
