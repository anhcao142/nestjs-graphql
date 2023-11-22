import { registerEnumType } from '@nestjs/graphql';

export enum Interval {
  ONE_MIN = '1min',
  FIVE_MIN = '5min',
  FIFTEEN_MIN = '15min',
  THIRTY_MIN = '30min',
  SIXTY_MIN = '60min',
}

registerEnumType(Interval, {
  name: 'Interval',
  description: 'Interval for time series data',
});
