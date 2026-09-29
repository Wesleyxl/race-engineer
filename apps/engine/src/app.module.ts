import { Module } from '@nestjs/common'

import { IpcModule } from './ipc/ipc.module'
import { LogModule } from './logs/log.module'
import { SimulatorModule } from './simulators/simulator.module'
import { TelemetryModule } from './telemetry/telemetry.module'

@Module({
  imports: [LogModule, SimulatorModule, TelemetryModule, IpcModule],
})
export class AppModule {}
