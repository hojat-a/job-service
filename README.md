
# Job Service

A NestJS-based REST API for fetching, filtering, and managing job offers aggregated from multiple external providers.  

---

## Table of Contents
- [Job Service](#job-service)
  - [Table of Contents](#table-of-contents)
  - [Technologies and Libraries](#technologies-and-libraries)
  - [Features](#features)
  - [Project Structure](#project-structure)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
    - [Using Docker for PostgreSQL](#using-docker-for-postgresql)
    - [Starting the Application](#starting-the-application)
  - [Database Migrations](#database-migrations)
  - [Adding New Job Providers](#adding-new-job-providers)
  - [Architecture Decisions](#architecture-decisions)
  - [Testing](#testing)

---

## Technologies and Libraries

- **Node.js** - JavaScript runtime  
- **Nest.js** - Web framework  
- **PostgreSql** - SQL database  
- **TypeOrm** - Object-Relational Mapper  
- **Jest** - Testing framework  
- **Supertest** - HTTP assertions for testing 

---

## Features

- Fetch job offers from multiple providers with retry and exponential backoff  
- DTOs and validation for incoming request data  
- Pagination and filtering by title, city, state, and salary range  
- Consistent API response format  
- Swagger documentation for API endpoints  
- End-to-end tests with Jest and Supertest  
- Configurable constants and environment variables  

---

## Project Structure

```
src/
│
├── modules/              # All feature/business logic modules
│   └── jobs/
│       ├── jobs.controller.ts
│       ├── jobs.service.ts
│       ├── jobs.module.ts
|       ├── jobs.repository.ts
│       ├── dto/
|       ├── interfaces
|       ├── integrations
│       ├── entities/
│       └── ...
│   
│
├── common/               # App-specific reusable things
│   ├── filters/
│   └── utils/
│
├── database/             # Database-specific
│   ├── snake-naming.strategy.ts
│   ├── database.module.ts
│   ├── migrations-config.ts
│   └── migrations/
│
├── config/               # App configuration files
│   ├── config.service.ts
│   └── ...
│
├── app.module.ts
└── main.ts

```
---

## Getting Started

### Prerequisites

- Node.js >= 18.x  
- npm or yarn  
- PostgreSQL
- docker and docker-compose (if you want to access DB by docker)

### Installation

```bash
git clone https://github.com/hojat-a/job-service.git job-service
cd job-service
npm install
```

### Environment Variables

Create a `.env` file at the root, copy the `.env.example` contents and set your configs

---

## Running the Application

### Using Docker for PostgreSQL

1. Start PostgreSQL:
   ```bash
   docker-compose up -d pg
   ```

2. Run database migrations:
   ```bash
   npm run migration:run
   ```

### Starting the Application

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`.

Swagger docs available at:  `http://localhost:3000/api`

---
## Database Migrations

```bash
# Generate a new migration
npm run migration:generate --name=`migration name` -t

# Run pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

## Adding New Job Providers

1. Create a new integration folder in `src/modules/jobs/integrations/`
2. Implement the service with `fetchJobs()` method
3. Create a mapper to transform provider data to the unified job interface
4. Add the provider URL and cron schedule to environment variables
5. Register the provider in `jobs.service.ts`

## Architecture Decisions

- **Repository Pattern**: Separates data access logic from business logic
- **DTO Validation**: Ensures data integrity at API boundaries
- **Global Exception Filter**: Provides consistent error responses
- **Configuration Service**: Centralizes all configuration access
- **Retry Utility**: Handles transient failures gracefully

--- 

## Testing

- Run e2e tests using Jest:
  ```bash
  npm run test:e2e
  ```

- Run unit tests using Jest:
  ```bash
  npm run test:unit
  ```

---