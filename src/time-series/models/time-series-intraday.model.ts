/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Field, ObjectType } from '@nestjs/graphql';
import { TimeSeries } from 'src/common/models';

@ObjectType()
class MetaDataWithInterval {
  @Field()
  information: string;

  @Field()
  symbol: string;

  @Field()
  lastRefreshed: string;

  @Field()
  interval: string;

  @Field()
  outputSize: string;

  @Field()
  timeZone: string;
}

@ObjectType()
export class TimeSeriesIntradayResult {
  @Field(type => MetaDataWithInterval)
  metadata: MetaDataWithInterval;

  @Field(type => [TimeSeries])
  timeSeries: TimeSeries[];
}
