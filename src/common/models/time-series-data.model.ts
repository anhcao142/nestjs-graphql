import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SeriesData {
  @Field()
  open: string;

  @Field()
  high: string;

  @Field()
  low: string;

  @Field()
  close: string;

  @Field()
  volume: string;
}

@ObjectType()
export class TimeSeries {
  @Field()
  time: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, prettier/prettier
  @Field(type => SeriesData)
  data: SeriesData;
}
