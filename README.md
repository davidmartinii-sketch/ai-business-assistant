# AI Business Assistant API

A minimal, production-ready Express.js API scaffold with linting, formatting, testing, and CI.

<!-- Replace with your repo URL when available -->
![CI](https://github.com/OWNER/REPO/actions/workflows/ci.yml/badge.svg)

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

## License

MIT
