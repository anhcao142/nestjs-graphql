import { Injectable } from '@nestjs/common';
import { GetDataInput, GetIntraDayInput } from './types/service.type';
import { objToQueryString, validateMonth } from 'src/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map } from 'rxjs';
import { DataType } from './dto';

const API_URL = 'https://www.alphavantage.co/query?';

@Injectable()
export class TimeSeriesService {
  private readonly apiKey: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.apiKey = this.configService.getOrThrow<string>(
      'ALPHA_VANTAGE_API_KEY',
    );
  }

  /**
   * Parse common time series data
   */
  private parseTimeSeriesData(rawTimeSeries: any): any {
    return Object.entries(rawTimeSeries).map(([time, seriesData]) => ({
      time,
      data: {
        open: seriesData['1. open'],
        high: seriesData['2. high'],
        low: seriesData['3. low'],
        close: seriesData['4. close'],
        volume: seriesData['5. volume'],
      },
    }));
  }

  /**
   * Execute alphavantage.co query and parse raw metadata and time series data
   */
  private async executeQuery(query: any): Promise<{
    rawMetadata: any;
    rawTimeSeries: any;
  }> {
    const url = `${API_URL}${objToQueryString(query)}`;
    const result = await firstValueFrom(
      this.httpService.get(url).pipe(
        map((res) => {
          if (res.data['Information']) {
            throw new Error(res.data['Information']);
          }

          if (res.data['Error Message']) {
            throw new Error(res.data['Error Message']);
          }

          return res.data;
        }),
      ),
    );

    const { rawMetadata, rawTimeSeries } = Object.keys(result).reduce(
      (acc, item) => {
        if (item.includes('Meta Data')) {
          acc.rawMetadata = result[item];
        } else {
          acc.rawTimeSeries = result[item];
        }

        return acc;
      },
      {} as { rawMetadata: any; rawTimeSeries: any },
    );

    if (!rawMetadata || !rawTimeSeries) {
      throw new Error('Invalid response');
    }

    return { rawMetadata, rawTimeSeries };
  }

  /**
   * Get intraday data
   */
  async getIntradayData({
    symbol,
    interval,
    adjusted,
    extendedHours,
    month,
    outputSize,
    dataType,
    apiKey,
  }: GetIntraDayInput): Promise<any> {
    if (dataType === DataType.CSV) {
      throw new Error('CSV format is not supported');
    }

    if (month) {
      validateMonth(month);
    }

    const query = {
      function: 'TIME_SERIES_INTRADAY',
      symbol,
      interval,
      adjusted,
      month,
      extended_hours: extendedHours,
      outputsize: outputSize,
      datatype: dataType,
      apikey: apiKey || this.apiKey,
    };

    const result = await this.executeQuery(query);
    const [rawMetadata, rawTimeSeries] = Object.values(result);
    const metadata = {
      information: rawMetadata['1. Information'],
      symbol: rawMetadata['2. Symbol'],
      lastRefreshed: rawMetadata['3. Last Refreshed'],
      interval: rawMetadata['4. Interval'],
      outputSize: rawMetadata['5. Output Size'],
      timeZone: rawMetadata['6. Time Zone'],
    };
    const timeSeries = this.parseTimeSeriesData(rawTimeSeries);

    return { metadata, timeSeries };
  }

  /**
   * Get data for daily, weekly, monthly
   */
  async getData({
    func,
    outputSize,
    dataType,
    apiKey,
    ...input
  }: GetDataInput): Promise<any> {
    if (dataType === DataType.CSV) {
      throw new Error('CSV format is not supported');
    }

    const query = {
      function: func,
      ...input,
      outputsize: outputSize,
      datatype: dataType,
      apikey: apiKey || this.apiKey,
    };

    const { rawMetadata, rawTimeSeries } = await this.executeQuery(query);
    const metadata = {
      information: rawMetadata['1. Information'],
      symbol: rawMetadata['2. Symbol'],
      lastRefreshed: rawMetadata['3. Last Refreshed'],
      outputSize: rawMetadata['4. Output Size'],
      timeZone: rawMetadata['5. Time Zone'],
    };
    const timeSeries = this.parseTimeSeriesData(rawTimeSeries);

    return { metadata, timeSeries };
  }
}
