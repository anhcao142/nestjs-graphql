# NestJs GraphQL Project (Alpha Vantage API)

This project demonstrates a simple CRUD operation using the NestJS framework with GraphQL, interacting with the Alpha Vantage API to retrieve stock price data.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Cloning the Project](#cloning-the-project)
  - [Setting Environment Variables](#setting-environment-variables)
  - [Installing Dependencies](#installing-dependencies)
- [Running the Application](#running-the-application)
- [Running Tests](#running-tests)
- [GraphQL Resolvers](#graphql-resolvers)
- [Example Usage](#example-usage)

## Prerequisites

- Node.js (v20.0.0 or later)
- npm / yarn
- Docker (optional)

## Getting Started

### Cloning the Project

To get started, clone the repository and navigate into the project directory:
```
git clone https://github.com/anhcao142/nestjs-graphql.git
cd nestjs-graphql
```

### Setting Environment Variables

You need to set your Alpha Vantage API Key as an environment variable. Create a .env file in the root directory and add the following:

```
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
```

Replace `your_alpha_vantage_api_key` with your actual API key.

### Installing Dependencies

Use npm or yarn to install the dependencies:

```
npm install
```

or

```
yarn
```

## Running the Application

You can run the application with or without Docker:

### With Docker:

Build the Docker image and start the container:

```
docker-compose up --build
```

This will build the Docker image and start the container. The app will be running on [http://localhost:3000](http://localhost:3000).

### Without Docker:

You can also start the application directly:

```
npm run start
```

or

```
yarn start
```

The app will be running on [http://localhost:3000](http://localhost:3000).

## Running Tests

The project includes automated tests using Jest. You can run these tests with:

```
npm test
```

or

```
yarn test
```

To continuously run tests on file changes, you can use:

```
npm run test:watch
```

or

```
yarn test:watch
```

To generate a coverage report, use:

```
npm run test:cov
```

or

```
yarn test:cov
```

## GraphQL Resolvers

The application has a GraphQL resolver to query stock price data from the Alpha Vantage API.

- `fetchIntradayData`: Retrieves intraday OHLCV "candles" data for a given equity, based on the ticker symbol and applicable parameters as defined in the API documentation. This includes both real-time and historical data, accounting for market splits and dividends.

- `fetchDailyData`: Retrieves raw daily 'candles' data for a specified equity, using the ticker symbol and relevant parameters from the API documentation.

- `fetchWeeklyData`: Fetches weekly 'candles' data for a specified equity, including data for the last trading day each week. This follows the same parameters and historical coverage as the daily data retrieval.

- `fetchMonthlyData`: Fetches monthly 'candles' data for a specified equity, including data for the last trading day each month. This follows the same parameters and historical coverage as the daily data retrieval.

## Example Usage

You can use any GraphQL client to send queries to the server. Navigate to `http://localhost:3000/graphql` to access the GraphQL playground.

Here is an example query:

```
query {
  fetchIntradayData(symbol: "IBM", interval: FIVE_MIN, outputSize: COMPACT) {
    metadata {
      information
      symbol
      lastRefreshed
      interval
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
```

Replace "IBM" with your desired stock symbol, FIVE_MIN with the desired interval (ONE_MIN, FIFTEEN_MIN, THIRTY_MIN and SIXTY_MIN), and COMPACT with FULL for the desired output size.

## Conclusion

This project demonstrates how to use NestJS with GraphQL to interact with the Alpha Vantage API. It includes the implementation of a GraphQL resolver to query stock price data and a Docker configuration for easy reproduction of the environment on any machine.
