import { Module } from '@nestjs/common'

import { LogModule } from '../logs/log.module'
import { SimulatorModule } from '../simulators/simulator.module'
import { TelemetryModule } from '../telemetry/telemetry.module'
import { IpcGateway } from './ipc.gateway'

@Module({
  imports: [LogModule, SimulatorModule, TelemetryModule],
  providers: [IpcGateway],
})
export class IpcModule {}
