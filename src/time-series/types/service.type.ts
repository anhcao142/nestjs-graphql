import { DataType, OutputSize } from '../dto';

export type GetIntraDayInput = {
  symbol: string;
  interval: string;
  adjusted?: boolean;
  extendedHours?: boolean;
  month?: string;
  outputSize?: OutputSize;
  dataType?: DataType;
  apiKey?: string;
};

export type GetDataInput = {
  symbol: string;
  outputSize?: OutputSize;
  dataType?: DataType;
  apiKey?: string;
  func: QUERY_FUNCTION;
};

export enum QUERY_FUNCTION {
  TIME_SERIES_DAILY = 'TIME_SERIES_DAILY',
  TIME_SERIES_DAILY_ADJUSTED = 'TIME_SERIES_DAILY_ADJUSTED',
  TIME_SERIES_WEEKLY = 'TIME_SERIES_WEEKLY',
  TIME_SERIES_WEEKLY_ADJUSTED = 'TIME_SERIES_WEEKLY_ADJUSTED',
  TIME_SERIES_MONTHLY = 'TIME_SERIES_MONTHLY',
  TIME_SERIES_MONTHLY_ADJUSTED = 'TIME_SERIES_MONTHLY_ADJUSTED',
}
