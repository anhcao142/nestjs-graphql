import { registerEnumType } from '@nestjs/graphql';

export enum DataType {
  JSON = 'json',
  CSV = 'csv',
}

registerEnumType(DataType, {
  name: 'DataType',
});
