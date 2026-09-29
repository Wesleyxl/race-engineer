/**
 * PacketHeader - present in all UDP packets.
 * Size: 29 bytes | Format: 2025
 */

export interface PacketHeader {
  /* 2025 */
  packetFormat: number;
  /** Game year - last two digits, ex.: 25 */
  gameYear: number;
  /** Major version - "X.00" */
  gameMajorVersion: number;
  /** Minor version - "1.XX" */
  gameMinorVersion: number;
  /** Version of this packet type (starts at 1) */
  packetVersion: number;
  /** Packet type identifier (PacketId) */
  packetId: number;
  /** Unique session UID */
  sessionUID: bigint;
  /** Timestamp of the session */
  sessionTime: number;
  /** Identifier of the frame in which the data was obtained */
  frameIdentifier: number;
  /** General frame identifier (does not regress after flashbacks) */
  overallFrameIdentifier: number;
  /** Index of the player's car in the array */
  playerCarIndex: number;
  /** Index of the second player (splitscreen); 255 if there is no second player */
  secondaryPlayerCarIndex: number;
}