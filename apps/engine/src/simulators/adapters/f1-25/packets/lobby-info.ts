/**
 * Lobby Info Packet
 * Frequency: 2/s in the lobby | Size: 954 bytes | Version: 1 | PacketId: 9
 */

import type { PacketHeader } from './header';

export interface LobbyInfoData {
  /** 1 = AI, 0 = Human */
  aiControlled: number;
  /** 255 if no team selected */
  teamId: number;
  nationality: number;
  /** 1 = Steam, 3 = PS, 4 = Xbox, 6 = Origin, 255 = unknown */
  platform: number;
  /** UTF-8, null-terminated, max 32 */
  name: string;
  carNumber: number;
  /** 0 = restricted, 1 = public */
  yourTelemetry: number;
  showOnlineNames: number;
  techLevel: number;
  /** 0 = not ready, 1 = ready, 2 = spectating */
  readyStatus: number;
}

export interface PacketLobbyInfoData {
  header: PacketHeader;
  numPlayers: number;
  lobbyPlayers: LobbyInfoData[];
}
