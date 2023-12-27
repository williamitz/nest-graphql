<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


## Description

[Nest](https://github.com/nestjs/nest) - GraphQl backend curse

## Installation

```bash
$ yarn install
```

## Development

1. Clone file .env.template
2. Rename file .env.template to .env
3. Running docker

```bash
# running docker compose
$ docker compose up -d

```
4. Run Seeder
```bash
# typeorm seeding config
$ yarn seed:config

# typeorm seeding
$ yarn seed:run

```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```