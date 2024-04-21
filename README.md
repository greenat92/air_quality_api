# Air Quality API with NestJS and MongoDB

This repository contains the source code and setup instructions for an Air Quality API built with NestJS and MongoDB.

## Table of Contents

- [Air Quality API with NestJS and MongoDB](#air-quality-api-with-nestjs-and-mongodb)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
    - [Installation](#installation)
    - [Running the Application](#running-the-application)
      - [Locally](#locally)
      - [Using Docker Compose](#using-docker-compose)
  - [Scripts](#scripts)
  - [Docker Compose](#docker-compose)
  - [API Documentation](#api-documentation)
  - [What I Would Improve:](#what-i-would-improve)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (>= v18.13.0)
- [Yarn](https://yarnpkg.com/) (>= v1.22.22)
- [Docker](https://www.docker.com/) (optional)

## Getting Started

### Installation

1. Clone the repository:

   \`\`\`bash
   git clone git@github.com:greenat92/air_quality_api.git
   \`\`\`

2. Navigate to the project directory:

   \`\`\`bash
   cd air_quality_api.git
   \`\`\`

3. Install dependencies:

   \`\`\`bash
   yarn install
   \`\`\`

### Running the Application

#### Locally

1. Start MongoDB:

   \`\`\`bash
   docker-compose up mongodb
   \`\`\`

2. Run the application:

   \`\`\`bash
   npm run start:dev
   \`\`\`

#### Using Docker Compose

1. Build and start all services:

   \`\`\`bash
   docker-compose up --build
   \`\`\`

## Scripts

- \`build\`: Build the NestJS application.
- \`format\`: Format TypeScript files using Prettier.
- \`start\`: Start the NestJS application.
- \`start:dev\`: Start the application in development mode with watch mode enabled.
- \`start:debug\`: Start the application in debug mode with watch mode enabled.
- \`start:prod\`: Start the compiled application.
- \`lint\`: Lint TypeScript files using ESLint.
- \`test\`: Run all tests.
- \`test:unit\`: Run unit tests.
- \`test:smoke\`: Run smoke tests.
- \`test:e2e\`: Run end-to-end tests.

## Docker Compose

The \`docker-compose.yml\` file defines two services:

- \`mongodb\`: MongoDB database container.
- \`air-quality-api\`: NestJS application container.

To start both services, run:

\`\`\`bash
docker-compose up --build
\`\`\`

To start only the MongoDB service, run:

\`\`\`bash
docker-compose up mongodb
\`\`\`

## API Documentation

API documentation will be available at \`http://localhost:4000/api/docs` when the application is running.

## What I Would Improve:

Given more time, there are several aspects I would focus on enhancing:
1- Implementing more robust caching strategies to optimise data retrieval from the IQAir provider as explained in docs analyses section.
2- Refactoring and cleaning up the codebase to enhance readability, maintainability, and overall quality.
3- Implementing a comprehensive testing framework to ensure code reliability and identify potential issues.
