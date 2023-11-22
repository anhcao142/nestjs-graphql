import { registerEnumType } from '@nestjs/graphql';

export enum OutputSize {
  COMPACT = 'compact',
  FULL = 'full',
}

registerEnumType(OutputSize, {
  name: 'OutputSize',
});
