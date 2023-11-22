import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MetaData {
  @Field()
  information: string;

  @Field()
  symbol: string;

  @Field()
  lastRefreshed: string;

  @Field()
  outputSize: string;

  @Field()
  timeZone: string;
}
