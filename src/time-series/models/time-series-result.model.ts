/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Field, ObjectType } from '@nestjs/graphql';
import { MetaData, TimeSeries } from 'src/common/models';

@ObjectType()
export class TimeSeriesResult {
  @Field(type => MetaData)
  metadata: MetaData;

  @Field(type => [TimeSeries])
  timeSeries: TimeSeries[];
}
