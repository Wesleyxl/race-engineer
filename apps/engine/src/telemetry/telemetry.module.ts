import { Module } from '@nestjs/common'

import { LogModule } from '../logs/log.module'
import { SimulatorModule } from '../simulators/simulator.module'
import { TelemetryService } from './telemetry.service'

@Module({
  imports: [LogModule, SimulatorModule],
  providers: [TelemetryService],
  exports: [TelemetryService],
})
export class TelemetryModule {}
