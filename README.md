<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456

[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">Project built with NestJS Framework.</p>

## Description
...
## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

```

### Running with Docker Compose
```bash
# there is a docker-compose.dev.yml for development purposes only
$  docker-compose -f docker-compose.dev.yml up

# there is a docker-compose.test.yml for run e2e tests
$  docker-compose -f docker-compose.test.yml up

# for prune purposes this command will clean all related contained, image and volume for this project only
$ docker-compose -f docker-compose.dev.yml down -v --rmi all
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Docs

Nest is an MIT-licensed open source project. [read more here](https://docs.nestjs.com/support).

## Environment variables

File `.env` example

```text
APP_NAME=POSTERR

NODE_ENV=dev
APP_VERSION=1.0.0
APP_PORT=22200
APP_DEBUGGER_PORT=22300

DB_HOST=database
DB_ROOT_PASSWORD=123
DB_USER=billy
DB_PASSWORD=123
