import { Resolver, Query, Args } from '@nestjs/graphql';
import { TimeSeriesService } from './time-series.service';
import { TimeSeriesIntradayResult, TimeSeriesResult } from './models';
import { Interval } from './dto/interval.arg';
import { DataType, OutputSize } from './dto';
import { QUERY_FUNCTION } from './types/service.type';

// eslint-disable-next-line prettier/prettier, @typescript-eslint/no-unused-vars
@Resolver('TimeSeries')
export class TimeSeriesResolver {
  constructor(private timeSeriesService: TimeSeriesService) {}

  // eslint-disable-next-line prettier/prettier, @typescript-eslint/no-unused-vars
  @Query(returns => TimeSeriesIntradayResult)
  async fetchIntradayData(
    @Args('symbol') symbol: string,
    @Args('interval', { type: () => Interval }) interval: string,
    @Args('adjusted', { nullable: true }) adjusted: boolean,
    @Args('extended_hours', { nullable: true }) extendedHours: boolean,
    @Args('month', { nullable: true }) month: string,
    @Args('outputSize', { type: () => OutputSize, nullable: true })
    outputSize: OutputSize,
    @Args('dataType', { type: () => DataType, nullable: true })
    dataType: DataType,
    @Args('apiKey', { nullable: true }) apiKey: string,
  ) {
    return this.timeSeriesService.getIntradayData({
      symbol,
      interval,
      adjusted,
      extendedHours,
      month,
      outputSize,
      dataType,
      apiKey,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, prettier/prettier
  @Query(returns => TimeSeriesResult)
  async fetchDailyData(
    @Args('symbol') symbol: string,
    @Args('outputSize', { type: () => OutputSize, nullable: true })
    outputSize: OutputSize,
    @Args('dataType', { type: () => DataType, nullable: true })
    dataType: DataType,
    @Args('apiKey', { nullable: true }) apiKey: string,
  ) {
    return this.timeSeriesService.getData({
      symbol,
      outputSize,
      dataType,
      apiKey,
      func: QUERY_FUNCTION.TIME_SERIES_DAILY,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, prettier/prettier
  @Query(returns => TimeSeriesResult)
  async fetchWeeklyData(
    @Args('symbol') symbol: string,
    @Args('outputSize', { type: () => OutputSize, nullable: true })
    outputSize: OutputSize,
    @Args('dataType', { type: () => DataType, nullable: true })
    dataType: DataType,
    @Args('apiKey', { nullable: true }) apiKey: string,
  ) {
    return this.timeSeriesService.getData({
      symbol,
      outputSize,
      dataType,
      apiKey,
      func: QUERY_FUNCTION.TIME_SERIES_WEEKLY,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, prettier/prettier
  @Query(returns => TimeSeriesResult)
  async fetchMonthlyData(
    @Args('symbol') symbol: string,
    @Args('outputSize', { type: () => OutputSize, nullable: true })
    outputSize: OutputSize,
    @Args('dataType', { type: () => DataType, nullable: true })
    dataType: DataType,
    @Args('apiKey', { nullable: true }) apiKey: string,
  ) {
    return this.timeSeriesService.getData({
      symbol,
      outputSize,
      dataType,
      apiKey,
      func: QUERY_FUNCTION.TIME_SERIES_WEEKLY,
    });
  }
}
