import { Module } from '@nestjs/common'

import { LogModule } from '../logs/log.module'
import { SimulatorService } from './simulator.service'

@Module({
  imports: [LogModule],
  providers: [SimulatorService],
  exports: [SimulatorService],
})
export class SimulatorModule {}
