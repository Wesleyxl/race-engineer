/**
 * Car Telemetry Packet
 * Frequency: rate of the menu | Size: 1352 bytes | Version: 1 | PacketId: 6
 *
 * Tyre arrays [4]: RL, RR, FL, FR.
 */

import type { PacketHeader } from './header';

export interface CarTelemetryData {
  /** km/h */
  speed: number;

  /** 0.0–1.0 */
  throttle: number;

  /** -1.0 (left) ... 1.0 (right) */
  steer: number;

  /** 0.0–1.0 */
  brake: number;

  /** 0–100 */
  clutch: number;
  /** 1–8, N=0, R=-1 (neutral) */
  gear: number;
  engineRPM: number;

  /** 0 = off, 1 = on */
  drs: number;
  revLightsPercent: number;

  /** bit 0 = left LED, bit 14 = right LED */
  revLightsBitValue: number;

  /** Brakes temperature (°C) — [RL, RR, FL, FR] */
  brakesTemperature: number[];
  tyresSurfaceTemperature: number[];
  tyresInnerTemperature: number[];
  engineTemperature: number;

  /** PSI */
  tyresPressure: number[];

  /** See appendix of surface types */
  surfaceType: number[];
}

export interface PacketCarTelemetryData {
  header: PacketHeader;
  carTelemetryData: CarTelemetryData[];
  /**
   * Index of the MFD panel open; 255 = closed.
   * Single player race: 0 = setup, 1 = pits, 2 = damage, 3 = engine, 4 = temps
   */
  mfdPanelIndex: number;
  mfdPanelIndexSecondaryPlayer: number;
  /** Suggested gear 1–8; 0 = none */
  suggestedGear: number;
}
