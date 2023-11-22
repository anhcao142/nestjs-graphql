import { Module } from '@nestjs/common';
import { TimeSeriesService } from './time-series.service';
import { HttpModule } from '@nestjs/axios';
import { TimeSeriesResolver } from './time-series.resolver';

@Module({
  imports: [HttpModule, TimeSeriesModule],
  providers: [TimeSeriesResolver, TimeSeriesService],
})
export class TimeSeriesModule {}
