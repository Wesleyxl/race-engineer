/**
 * Telemetry Model
 * Regardless of the simulator used, the rest of the system consumes only this format.
 */

// Data for the wheels.
export interface WheelValues {
  rearLeft: number;
  rearRight: number;
  frontLeft: number;
  frontRight: number;
}

export type TyreWear = WheelValues;

// Surface, inner and rim temperature of each tyre.
export interface TyreTemperature {
  surface: WheelValues;
  inner: WheelValues;
  rim: WheelValues;
}

// data for the world position.
export interface WorldPosition {
  x: number;
  y: number;
  z: number;
}

export interface Orientation {
  yaw: number;
  pitch: number;
  roll: number;
}

// data for the car damage.
export interface Damage {
  frontLeftWing: number;
  frontRightWing: number;
  rearWing: number;
  floor: number;
  diffuser: number;
  sidepod: number;
  gearbox: number;
  engine: number;
}

// data for the ERS energy.
export interface ErsState {
  storeEnergy: number;
  deployMode: number;
  harvestedThisLapMguk: number;
  harvestedThisLapMguh: number;
  deployedThisLap: number;
}

// data for telemetry model
export interface TelemetryModel {
  timestamp: number;

  speed: number;
  speedKmh: number;
  throttle: number;
  brake: number;
  steering: number;
  clutch: number;
  gear: number;
  rpm: number;

  fuel: number;
  fuelCapacity: number;
  fuelRemainingLaps: number;

  tyreWear: TyreWear;
  tyreTemperature: TyreTemperature;
  tyrePressure: WheelValues;
  tyreCompound: number;
  tyreAgeLaps: number;

  trackTemperature: number;
  airTemperature: number;
  weather: number;
  trackGrip: number;

  lap: number;
  totalLaps: number;
  sector: number;
  position: number;
  deltaFront: number;
  deltaBehind: number;
  raceTime: number;
  sessionType: number;

  sessionUid: string;

  driverStatus: number;

  isOnTrack: boolean;

  sessionStarted: boolean;

  startLights: number;

  drs: boolean;
  drsAvailable: boolean;
  ers: ErsState;
  pitLimiter: boolean;
  yellowFlag: boolean;
  blueFlag: boolean;

  worldPosition: WorldPosition;
  orientation: Orientation;

  damage: Damage;
}

/**
 * Create an empty telemetry model.
 */
export function createEmptyTelemetry(): TelemetryModel {
  const zeroWheels = () => ({
    rearLeft: 0,
    rearRight: 0,
    frontLeft: 0,
    frontRight: 0,
  });

  return {
    timestamp: Date.now(),
    speed: 0,
    speedKmh: 0,
    throttle: 0,
    brake: 0,
    steering: 0,
    clutch: 0,
    gear: 0,
    rpm: 0,
    fuel: 0,
    fuelCapacity: 0,
    fuelRemainingLaps: 0,
    tyreWear: zeroWheels(),
    tyreTemperature: {
      surface: zeroWheels(),
      inner: zeroWheels(),
      rim: zeroWheels(),
    },
    tyrePressure: zeroWheels(),
    tyreCompound: 0,
    tyreAgeLaps: 0,
    trackTemperature: 0,
    airTemperature: 0,
    weather: 0,
    trackGrip: 0,
    lap: 0,
    totalLaps: 0,
    sector: 0,
    position: 0,
    deltaFront: 0,
    deltaBehind: 0,
    raceTime: 0,
    sessionType: 0,
    sessionUid: '',
    driverStatus: 0,
    isOnTrack: false,
    sessionStarted: false,
    startLights: 0,
    drs: false,
    drsAvailable: false,
    ers: {
      storeEnergy: 0,
      deployMode: 0,
      harvestedThisLapMguk: 0,
      harvestedThisLapMguh: 0,
      deployedThisLap: 0,
    },
    pitLimiter: false,
    yellowFlag: false,
    blueFlag: false,
    worldPosition: { x: 0, y: 0, z: 0 },
    orientation: { yaw: 0, pitch: 0, roll: 0 },
    damage: {
      frontLeftWing: 0,
      frontRightWing: 0,
      rearWing: 0,
      floor: 0,
      diffuser: 0,
      sidepod: 0,
      gearbox: 0,
      engine: 0,
    },
  };
}
