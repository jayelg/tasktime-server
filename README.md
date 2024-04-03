# Migrated into monorepo project
# Moved to [johngrantdev/tasktime](https://github.com/johngrantdev/tasktime)

# Tasktime Server

The tasktime backend service provides a REST API with validation, authentication and authorization for the tasktime app.

## Some of the tech and packages used

The full list of packages used can be seen in the [package.json](https://github.com/jayelg/tasktime-server/blob/main/package.json) file.

written in [Typescript](https://www.typescriptlang.org/)

[Nest js](https://www.passportjs.org/packages/passport-magic-login/) - module based backend Node.js framework providing modules for express js, jest, jwt, class-validator, mailer, among others.

[Passport with magic login](https://www.passportjs.org/packages/passport-magic-login/) - Passwordless authentication using magic links sent to users email address.

[Handlebars](https://handlebarsjs.com/) - Templating lanugage to dynamicly generate static html/css. Used to send email sign-in links, notifications etc.

[Maizzle](https://maizzle.com) - Framework for creating HTML/CSS packages using tailwindCSS. This is configured to generate handlebars templates

[Mikro ORM](https://mikro-orm.io/) - Postgres

[Swagger](https://swagger.io/) - API Documentation

## Database ERD (WIP)

The below link is the working design for the database schema.

[Entity Relationship Diagram](https://viewer.diagrams.net/?tags=%7B%7D&highlight=0000ff&layers=1&nav=1&title=Tasktime%20DB%20Schema%20ERD.drawio#Uhttps%3A%2F%2Fraw.githubusercontent.com%2Fjayelg%2Ftasktime-server%2Fmain%2Fdocuments%2FTasktime%2520DB%2520Schema%2520ERD.drawio)

## First Prototype

I initially started building this using express js which can be viewed at the following branch of this repo.

[Express branch](https://github.com/jayelg/tasktime-server/tree/express)

## Running the server

### Clone Repo

Requirements: Node.js and npm package manager installed.

create a .env file in the root directory of the project with the following parameters.

```bash
APP_NAME = 'tasktime server'
APP_DESCRIPTION = 'The tasktime backend service provides a REST API with validation, authentication and authorization for the tasktime app.'
SERVER_URL = http://localhost:3010
JWT_SECRET_KEY = generated_long_secret_key
DB_NAME = tasktimedev
DB_HOST = db_host_URL
DB_PORT = 5432
DB_USER = postgres
DB_PASS = dbpassword
SMTP_URL = smtp.mailprovider.com
SMTP_PORT = 587
SMTP_USER = postmaster@site.com
SMTP_PASS = SMTPPassword
SMTP_FROM_ADDRESS = support@site.com
```

Use of of the following commands to run the server.

```bash
# dev mode watching for changes
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Docker

Follow these steps to create a docker image of this project.

The below command will compile the typescript sourcecode to javascript in the dist directory.

```bash
$ npm run build
```

The below command will create the docker image on the system.

```bash
$ docker build -t tasktime-server:dev-latest .
```

### Docker-Compose

The below docker compose file uses enviroment variables. Place the .env file shown above in the same directory as this file.

```bash
version: "3.7"

services:
  tasktime-server-dev:
    image: tasktime-server:dev-latest
    container_name: tasktime-server-dev
    ports:
      - "3030:8080"
    environment:
      - APP_NAME=$APP_NAME
      - APP_DESCRIPTION=$APP_DESCRIPTION
      - SERVER_URL=$SERVER_URL
      - JWT_SECRET_KEY=$JWT_SECRET_KEY
      - DB_NAME=$DB_NAME
      - DB_HOST=$DB_HOST
      - DB_PORT=$DB_PORT
      - DB_USER=$DB_USER
      - DB_PASS=$DB_PASS
      - SMTP_URL=$SMTP_URL
      - SMTP_PORT=$SMTP_PORT
      - SMTP_USER=$SMTP_USER
      - SMTP_PASS=$SMTP_PASS
      - SMTP_FROM_ADDRESS=$SMTP_FROM_ADDRESS
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

## Use

There is no license on this project and so all copyright protections are reserved.
Please contact me at john@raur.net if you would like to use this project.
