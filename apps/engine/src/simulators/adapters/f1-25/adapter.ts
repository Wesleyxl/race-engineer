/**
 * titulo: "Adapter EA Sports F1 25"
 * descricao: "Agrega vários tipos de pacote UDP (motion, session, lap, event, telemetry, status, damage) num estado interno e monta TelemetryModel do jogador. Event STLG/LGOT alimenta startLights para o Get Ready. Sem CarTelemetry ainda, devolve null."
 */

import type { SimulatorAdapter } from '../../simulator.adapter'
import {
  createEmptyTelemetry,
  type TelemetryModel,
  type WheelValues,
} from '../../../core/model/telemetry.model'
import { PacketId, SIMULATOR_ID, WheelIndex } from './constants'
import { EventCode } from './packets/event'
import type { PacketCarDamageData } from './packets/car-damage'
import type { PacketCarStatusData } from './packets/car-status'
import type { PacketCarTelemetryData } from './packets/car-telemetry'
import type { PacketLapData } from './packets/lap-data'
import type { PacketMotionData } from './packets/motion'
import type { PacketSessionData } from './packets/session'
import type { StartLightsEvent } from './packets/event'
import {
  parseCarDamagePacket,
  parseCarStatusPacket,
  parseCarTelemetryPacket,
  parseEventPacket,
  parseLapDataPacket,
  parseMotionPacket,
  parseSessionPacket,
  peekPacketId,
} from './parser'

interface F125State {
  telemetry?: PacketCarTelemetryData
  status?: PacketCarStatusData
  lap?: PacketLapData
  session?: PacketSessionData
  damage?: PacketCarDamageData
  motion?: PacketMotionData
  playerCarIndex: number
  sessionUid: string
  /** Luzes de largada (Event STLG) — 0 se nenhuma */
  startLights: number
}

/** driverStatus F1: 0 garage … 4 on track */
const DRIVER_STATUS_ON_TRACK_MIN = 1

function toWheels(values: number[]): WheelValues {
  return {
    rearLeft: values[WheelIndex.RearLeft] ?? 0,
    rearRight: values[WheelIndex.RearRight] ?? 0,
    frontLeft: values[WheelIndex.FrontLeft] ?? 0,
    frontRight: values[WheelIndex.FrontRight] ?? 0,
  }
}

function deltaToSeconds(msPart: number, minutesPart: number): number {
  return minutesPart * 60 + msPart / 1000
}

/**
 * Adapter F1 25: agrega pacotes UDP do protocolo Codemasters
 * e produz TelemetryModel padronizado.
 */
export class F125Adapter implements SimulatorAdapter {
  readonly id = SIMULATOR_ID
  readonly name = 'F1 25'
  readonly description = 'EA Sports F1 25 — UDP telemetry'
  readonly defaultUdpPort = 20777

  private readonly state: F125State = {
    playerCarIndex: 0,
    sessionUid: '',
    startLights: 0,
  }

  parse(buffer: Buffer): TelemetryModel | null {
    const packetId = peekPacketId(buffer);

    switch (packetId) {
      case PacketId.Motion: {
        this.state.motion = parseMotionPacket(buffer);
        this.rememberHeader(this.state.motion.header);
        break;
      }
      case PacketId.Session: {
        this.state.session = parseSessionPacket(buffer);
        this.rememberHeader(this.state.session.header);
        break;
      }
      case PacketId.LapData: {
        this.state.lap = parseLapDataPacket(buffer);
        this.rememberHeader(this.state.lap.header);
        break;
      }
      case PacketId.Event: {
        this.applyEvent(buffer);
        break;
      }
      case PacketId.CarTelemetry: {
        this.state.telemetry = parseCarTelemetryPacket(buffer);
        this.rememberHeader(this.state.telemetry.header);
        break;
      }
      case PacketId.CarStatus: {
        this.state.status = parseCarStatusPacket(buffer);
        this.rememberHeader(this.state.status.header);
        break;
      }
      case PacketId.CarDamage: {
        this.state.damage = parseCarDamagePacket(buffer);
        this.rememberHeader(this.state.damage.header);
        break;
      }
      default:
        return null;
    }

    // Precisa ao menos de telemetria do carro para publicar um snapshot
    if (!this.state.telemetry) {
      return null;
    }

    return this.toTelemetryModel();
  }

  private rememberHeader(header: {
    playerCarIndex: number;
    sessionUID: bigint;
  }): void {
    this.state.playerCarIndex = header.playerCarIndex;
    this.state.sessionUid = header.sessionUID.toString();
  }

  /** Interpreta Event UDP — STLG preenche startLights para a regra GetReady */
  private applyEvent(buffer: Buffer): void {
    const event = parseEventPacket(buffer);
    this.rememberHeader(event.header);

    if (event.eventStringCode === EventCode.StartLights) {
      const details = event.eventDetails as StartLightsEvent;
      this.state.startLights = details.numLights ?? 0;
      return;
    }

    if (event.eventStringCode === EventCode.LightsOut) {
      this.state.startLights = 0;
    }
  }

  private toTelemetryModel(): TelemetryModel {
    const idx = this.state.playerCarIndex;
    const model = createEmptyTelemetry();

    const car = this.state.telemetry!.carTelemetryData[idx];
    if (car) {
      model.speed = car.speed;
      model.speedKmh = car.speed;
      model.throttle = car.throttle;
      model.brake = car.brake;
      model.steering = car.steer;
      model.clutch = car.clutch / 100;
      model.gear = car.gear;
      model.rpm = car.engineRPM;
      model.drs = car.drs === 1;
      model.tyreTemperature = {
        surface: toWheels(car.tyresSurfaceTemperature),
        inner: toWheels(car.tyresInnerTemperature),
        // O pacote CarTelemetry do F1 25 não traz temperatura de aro.
        rim: toWheels([]),
      };
      model.tyrePressure = toWheels(car.tyresPressure);
    }

    const status = this.state.status?.carStatusData[idx];
    if (status) {
      model.fuel = status.fuelInTank;
      model.fuelCapacity = status.fuelCapacity;
      model.fuelRemainingLaps = status.fuelRemainingLaps;
      model.tyreCompound = status.visualTyreCompound;
      model.tyreAgeLaps = status.tyresAgeLaps;
      model.drsAvailable = status.drsAllowed === 1;
      model.pitLimiter = status.pitLimiterStatus === 1;
      model.blueFlag = status.vehicleFiaFlags === 2;
      model.yellowFlag = status.vehicleFiaFlags === 3;
      model.ers = {
        storeEnergy: status.ersStoreEnergy,
        deployMode: status.ersDeployMode,
        harvestedThisLapMguk: status.ersHarvestedThisLapMGUK,
        harvestedThisLapMguh: status.ersHarvestedThisLapMGUH,
        deployedThisLap: status.ersDeployedThisLap,
      };
    }

    const lap = this.state.lap?.lapData[idx];
    if (lap) {
      model.lap = lap.currentLapNum;
      model.sector = lap.sector + 1;
      model.position = lap.carPosition;
      model.deltaFront = deltaToSeconds(
        lap.deltaToCarInFrontMSPart,
        lap.deltaToCarInFrontMinutesPart,
      );
      model.raceTime = lap.currentLapTimeInMS / 1000;
      model.driverStatus = lap.driverStatus;
      model.isOnTrack = lap.driverStatus >= DRIVER_STATUS_ON_TRACK_MIN;
    }

    // Delta behind: diferença para o carro imediatamente atrás
    if (this.state.lap && lap) {
      const behind = this.state.lap.lapData.find(
        (other) => other.carPosition === lap.carPosition + 1,
      );
      if (behind) {
        model.deltaBehind = deltaToSeconds(
          behind.deltaToCarInFrontMSPart,
          behind.deltaToCarInFrontMinutesPart,
        );
      }
    }

    const session = this.state.session;
    if (session) {
      model.trackTemperature = session.trackTemperature;
      model.airTemperature = session.airTemperature;
      model.weather = session.weather;
      model.sessionType = session.sessionType;
      model.totalLaps = session.totalLaps;
      model.trackGrip = 1; // F1 25 não expõe grip explícito no pacote Session
    }

    model.sessionUid = this.state.sessionUid;
    model.startLights = this.state.startLights;
    model.sessionStarted =
      model.sessionType > 0 &&
      model.sessionUid.length > 0 &&
      model.isOnTrack;

    const damage = this.state.damage?.carDamageData[idx];
    if (damage) {
      model.tyreWear = toWheels(damage.tyresWear);
      model.damage = {
        frontLeftWing: damage.frontLeftWingDamage,
        frontRightWing: damage.frontRightWingDamage,
        rearWing: damage.rearWingDamage,
        floor: damage.floorDamage,
        diffuser: damage.diffuserDamage,
        sidepod: damage.sidepodDamage,
        gearbox: damage.gearBoxDamage,
        engine: damage.engineDamage,
      };
    }

    const motion = this.state.motion?.carMotionData[idx];
    if (motion) {
      model.worldPosition = {
        x: motion.worldPositionX,
        y: motion.worldPositionY,
        z: motion.worldPositionZ,
      };
      model.orientation = {
        yaw: motion.yaw,
        pitch: motion.pitch,
        roll: motion.roll,
      };
    }

    model.timestamp = Date.now();
    return model;
  }
}

export function createF125Adapter(): SimulatorAdapter {
  return new F125Adapter();
}
