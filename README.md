# NestJs GraphQL Project (Alpha Vantage API)

This project demonstrates a simple CRUD operation using the NestJS framework with GraphQL, interacting with the Alpha Vantage API to retrieve stock price data.

## Table of Contents

- [Requirements](#requirements)
- [Setup](#setup)
- [Running the app](#running-the-app)
- [GraphQL Resolvers](#graphql-resolvers)
- [Usage](#usage)

## Requirements

- Node.js (v20.0.0 or later)
- npm / yarn
- Docker (optional)

## Setup

### Clone the project

Clone the repository and navigate into the project directory:
```
git clone https://github.com/your_username/your_repo_name.git
cd your_repo_name
```

### Configuration

You need to set your Alpha Vantage API Key as an environment variable. Create a `.env` file in the root directory and add the following:

```
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
```

Replace `your_alpha_vantage_api_key` with your actual API key.

### Install dependencies

Use npm or yarn to install the dependencies:

```
npm install
```

or

```
yarn
```

## Running the app

### Using Docker:

Build the Docker image and start the container:

```
docker-compose up --build
```

This will build the Docker image and start the container. The app will be running on [http://localhost:3000](http://localhost:3000).

### Without Docker:

To start the app, run:

```
npm run start
```

or

```
yarn start
```

The app will be running on [http://localhost:3000](http://localhost:3000).

## GraphQL Resolvers

The application has a GraphQL resolver to query stock price data from the Alpha Vantage API.

- `getStockPrice`: Fetches historical market data based on ticker symbol and all supported parameters in the API document.

## Usage

You can use any GraphQL client to send queries to the server. Navigate to `http://localhost:3000/graphql` to access the GraphQL playground.

Here is an example query:

```
query {
  getStockPrice(symbol: "IBM", interval: "5min", outputSize: "compact") {
    open
    high
    low
    close
    volume
  }
}
```

Replace "IBM" with your desired stock symbol, "5min" with the desired interval, and "compact" with the desired output size.

## Conclusion

This project demonstrates how to use NestJS with GraphQL to interact with the Alpha Vantage API. It includes the implementation of a GraphQL resolver to query stock price data and a Docker configuration for easy reproduction of the environment on any machine.
