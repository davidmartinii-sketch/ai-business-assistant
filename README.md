# AI Business Assistant API

A production-ready Express.js API with PostgreSQL, Prisma ORM, JWT authentication, linting, testing, and CI/CD.

![CI](https://github.com/davidmartinii-sketch/ai-business-assistant/actions/workflows/ci.yml/badge.svg)

## Requirements

- Node.js 24.13.0 (see `.nvmrc`)
- npm 11+
- PostgreSQL 16+ (or use Prisma's local dev database)

## Quick Start

```bash
# Use the pinned Node version
nvm use

# Install dependencies
npm ci

# Copy environment variables
cp .env.example .env

# Start local Prisma Postgres database (recommended for development)
npx prisma dev

# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Start development server
npm run dev
```

## Database Setup

### Option 1: Prisma Dev Database (Recommended for Development)

```bash
# Start local Prisma Postgres (runs on ports 51213-51215)
npx prisma dev

# Push schema to database
npm run db:push
```

### Option 2: Docker Compose PostgreSQL

```bash
# Start PostgreSQL with Docker Compose
docker compose up -d postgres

# Update .env with Docker database URL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_business_assistant?schema=public"

# Push schema to database
npm run db:push
```

### Option 3: Your Own PostgreSQL

```bash
# Update .env with your database URL
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# Push schema to database
npm run db:push
```

## Database Commands

```bash
npm run db:generate    # Generate Prisma Client
npm run db:push        # Push schema to database (no migrations)
npm run db:migrate     # Create and run migrations
npm run db:studio      # Open Prisma Studio (database GUI)
```

## API Documentation

Interactive API documentation is available at:

```
http://localhost:3000/api/docs
```

Powered by Swagger UI and OpenAPI 3.0. Try out endpoints directly from the browser!

## Run

```bash
npm run dev     # Start with nodemon (auto-reload)
npm start       # Start production server
```

## Test

**Note:** Tests require a running database connection.

```bash
# Ensure database is running (see Database Setup above)
npx prisma dev  # or your PostgreSQL instance

# Run tests
npm test
```

## Lint & Format

```bash
npm run lint         # Check for issues
npm run lint:fix     # Auto-fix issues
npm run format       # Format code with Prettier
npm run format:check # Check formatting
```

## Project Structure

```
prisma/
  schema.prisma      # Database schema
src/
  app.js            # Express app setup
  server.js         # App entry point
  config/           # Configuration (database, auth, logging, swagger)
    database.js     # Prisma client singleton
    auth.js         # JWT configuration
    logger.js       # Pino structured logging
    swagger.js      # API documentation
  controllers/      # Request handlers
    authController.js   # Authentication (register, login, getMe)
    userController.js   # User CRUD operations
  middleware/       # Express middleware
    authenticate.js     # JWT verification
    errorHandler.js     # Centralized error handling
    logger.js           # HTTP request logging
    security.js         # Helmet + rate limiting
    validation.js       # Joi validation wrapper
  routes/           # API endpoints
    auth.js         # /auth routes (register, login, me)
    users.js        # /users routes (create, list)
    health.js       # /health endpoint
  validators/       # Joi validation schemas
    authValidator.js    # Auth request validation
    userValidator.js    # User request validation
tests/              # Jest test suites
```

## Environment

Copy the example file and edit as needed:

```bash
cp .env.example .env
```

## Features

### Core
- **PostgreSQL Database** with Prisma ORM for type-safe queries
- **JWT Authentication** with register, login, and protected routes
- **Structured Logging** with Pino (JSON in production, pretty-print in dev)
- **API Documentation** with Swagger UI/OpenAPI 3.0 at `/api/docs`
- **Input Validation** using Joi with detailed error messages
- **Error Handling** centralized middleware with proper status codes
- **Security Hardening** via Helmet (security headers) and rate limiting

### Code Quality
- **ESLint** with strict rules (no-var, prefer-const, eqeqeq)
- **Prettier** for consistent code formatting
- **Husky** pre-commit hooks with lint-staged (auto-fixes on commit)
- **Jest** testing with 23 tests covering all endpoints
- **GitHub Actions** CI with Node matrix (22, 24), lint + test jobs

### DevOps
- **Docker** multi-stage Alpine build with non-root user
- **Docker Compose** for local development with PostgreSQL
- **Health checks** for monitoring (`/health` endpoint)
- **Environment validation** with envalid (fail-fast on missing vars)
- **Node version pinning** via `.nvmrc` and `package.json` engines

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Hello World | ❌ |
| GET | `/health` | Health check | ❌ |
| POST | `/auth/register` | Create new user account | ❌ |
| POST | `/auth/login` | Login with credentials | ❌ |
| GET | `/auth/me` | Get current user info | ✅ |
| POST | `/users` | Create user | ❌ |
| GET | `/users` | List all users | ❌ |
| GET | `/api/docs` | Swagger UI | ❌ |

## CI

GitHub Actions runs lint and tests on push and PRs.

## Docker

### Local Development with Docker Compose

```bash
# Start the app with Docker Compose
docker compose up

# The API will be available at http://localhost:3000
# Changes to src/ are reflected live (volume mounted)
```

### Production Docker Build

```bash
# Build the image
docker build -t ai-business-assistant:latest .

# Run the container
docker run -p 3000:3000 -e PORT=3000 ai-business-assistant:latest
```

The Dockerfile uses a multi-stage build for optimal image size and security:
- Alpine Linux (lightweight base)
- Non-root user execution
- Health checks enabled
- Production-optimized

## License

MIT
