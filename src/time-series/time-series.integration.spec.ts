import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TimeSeriesModule } from './time-series.module';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TimeSeriesService } from './time-series.service';

describe('TimeSeriesModule (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => ({
              ALPHA_VANTAGE_API_KEY: 'demo',
            }),
          ],
        }),
        TimeSeriesModule,
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: 'schema.gql',
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Mock response data from alphavantage.co so test
    // won't depend on internet connection and API key
    const timeSeriesService = app.get<TimeSeriesService>(TimeSeriesService);
    jest.spyOn(timeSeriesService as any, 'executeQuery').mockResolvedValue({
      rawMetadata: {
        '1. Information': 'mock information',
        '2. Symbol': 'mock symbol',
        '3. Last Refreshed': 'mock lastRefreshed',
        '4. Interval': 'mock interval',
        '4. Output Size': 'mock output size',
        '5. Output Size': 'mock output size',
        '5. Time Zone': 'mock time zone',
        '6. Time Zone': 'mock time zone',
      },
      rawTimeSeries: {
        'mock time': {
          '1. open': 'mock open',
          '2. high': 'mock high',
          '3. low': 'mock low',
          '4. close': 'mock close',
          '5. volume': 'mock volume',
        },
      },
    });
  });

  describe('fetchIntradayData', () => {
    it('fetch data intraday successfully', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query {
              fetchIntradayData(symbol: "IBM", interval: FIVE_MIN) {
                metadata {
                  information
                  symbol
                  lastRefreshed
                  outputSize
                  timeZone
                }
                timeSeries {
                  time
                  data {
                    open
                    high
                    low
                    close
                    volume
                  }
                }
              }
            }
          `,
        })
        .expect((res) => {
          expect(res.body.errors).not.toBeDefined();
        })
        .expect(200);
    });

    it('throws error for CSV data type', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query {
              fetchIntradayData(symbol: "IBM", interval: FIVE_MIN, dataType: CSV) {
                metadata {
                  information
                  symbol
                  outputSize
                }
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors[0].message).toContain(
            'CSV format is not supported',
          );
        });
    });

    it('throws error for missing required argument', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query {
              fetchIntradayData(symbol: "IBM", dataType: JSON) {
                metadata {
                  information
                  symbol
                  outputSize
                }
              }
            }
          `,
        })
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        })
        .expect(400);
    });

    it('throws error for invalid month format', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query {
              fetchIntradayData(symbol: "IBM", interval: FIVE_MIN, month: "23-11") {
                metadata {
                  information
                  symbol
                  outputSize
                }
              }
            }
          `,
        })
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        })
        .expect(200);

      await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query {
              fetchIntradayData(symbol: "IBM", interval: FIVE_MIN, month: "2023-13") {
                metadata {
                  information
                  symbol
                  outputSize
                }
              }
            }
          `,
        })
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        })
        .expect(200);

      request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query {
              fetchIntradayData(symbol: "IBM", interval: FIVE_MIN, month: "YYYY-13") {
                metadata {
                  information
                  symbol
                  outputSize
                }
              }
            }
          `,
        })
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        })
        .expect(200);

      await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query {
              fetchIntradayData(symbol: "IBM", interval: FIVE_MIN, month: "1999-13") {
                metadata {
                  information
                  symbol
                  outputSize
                }
              }
            }
          `,
        })
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        })
        .expect(200);

      await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query {
              fetchIntradayData(symbol: "IBM", interval: FIVE_MIN, month: "2023-12") {
                metadata {
                  information
                  symbol
                  outputSize
                }
              }
            }
          `,
        })
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        })
        .expect(200);
    });
  });

  describe('fetchDailyData', () => {
    it('fetch data daily successfully', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query {
              fetchDailyData(symbol: "IBM", outputSize: COMPACT, dataType: JSON) {
                metadata {
                  information
                  symbol
                  lastRefreshed
                  outputSize
                  timeZone
                }
                timeSeries {
                  time
                  data {
                    open
                    high
                    low
                    close
                    volume
                  }
                }
              }
            }
          `,
        })
        .expect((res) => {
          expect(res.body.errors).not.toBeDefined();
        })
        .expect(200);
    });

    it('throws error for CSV data type', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query {
              fetchDailyData(symbol: "IBM", outputSize: COMPACT, dataType: CSV) {
                metadata {
                  information
                  symbol
                  outputSize
                }
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors[0].message).toContain(
            'CSV format is not supported',
          );
        });
    });

    it('throws error for missing required argument', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query {
              fetchDailyData(outputSize: COMPACT, dataType: JSON) {
                metadata {
                  information
                  symbol
                  outputSize
                }
              }
            }
          `,
        })
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        })
        .expect(400);
    });
  });

  describe('fetchWeeklyData', () => {
    it('fetch data weekly successfully', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query {
              fetchDailyData(symbol: "IBM", outputSize: COMPACT, dataType: JSON) {
                metadata {
                  information
                  symbol
                  lastRefreshed
                  outputSize
                  timeZone
                }
                timeSeries {
                  time
                  data {
                    open
                    high
                    low
                    close
                    volume
                  }
                }
              }
            }
          `,
        })
        .expect((res) => {
          expect(res.body.errors).not.toBeDefined();
        })
        .expect(200);
    });
  });

  describe('fetchMonthlyData', () => {
    it('fetch data monthly successfully', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query {
              fetchDailyData(symbol: "IBM", outputSize: COMPACT, dataType: JSON) {
                metadata {
                  information
                  symbol
                  lastRefreshed
                  outputSize
                  timeZone
                }
                timeSeries {
                  time
                  data {
                    open
                    high
                    low
                    close
                    volume
                  }
                }
              }
            }
          `,
        })
        .expect((res) => {
          expect(res.body.errors).not.toBeDefined();
        })
        .expect(200);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
