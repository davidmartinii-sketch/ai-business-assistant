# AI Business Assistant API

A minimal, production-ready Express.js API scaffold with linting, formatting, testing, and CI.

![CI](https://github.com/davidmartinii-sketch/ai-business-assistant/actions/workflows/ci.yml/badge.svg)

## Requirements

- Node.js 24.13.0 (see `.nvmrc`)
- npm 11+

## Setup

```bash
# use the pinned node version
nvm use

# install dependencies
npm ci
```

## Run

```bash
npm run dev     # start with nodemon
npm start       # start production server
```

## Test

```bash
npm test
```

## Lint & Format

```bash
npm run lint
npm run lint:fix
npm run format
npm run format:check
```

## Project Structure

```
src/
  app.js          # Express app
  server.js       # App entry point
  config/         # Environment config
  controllers/    # Route handlers
  routes/         # API routes
  models/         # Data models (placeholder)

tests/            # Jest tests
```

## Environment

Copy the example file and edit as needed:

```bash
cp .env.example .env
```

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
