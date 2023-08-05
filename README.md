# Tasktime Server

The tasktime backend service provides a REST API with validation, authentication and authorization for the tasktime app.

## Some of the tech used

[Typescript](https://www.typescriptlang.org/)

[Nest js](https://www.passportjs.org/packages/passport-magic-login/) - Node.js backend framework implementing express js

[Passport with magic login](https://www.passportjs.org/packages/passport-magic-login/) - Passwordless authentication using magic links sent to users email address.

[Handlebars](https://handlebarsjs.com/) - Templating lanugage to dynamicly generate static html/css for use in emails

[Maizzle](https://maizzle.com) - Framework for creating HTML/CSS packages using tailwindCSS. This is configured to generate handlebars templates

[Mongoose](https://mongoosejs.com/) - MongoDB

## Enviroment

create a .env file in the root of the project with the following parameters.

```bash
APP_NAME = 'tasktime server'
SERVER_URL = http://localhost
DATABASE_URL = mongodb+srv://user:password@somedatabase.mongodb.net/
PORT = 3000
JWT_SECRET_KEY = dc3ad6lkrrZ-generatedLongSecretKey-e3iicl60sxhh
SMTP_URL = smtp.sendgridOrMailgun.com
SMTP_PORT = 587
SMTP_USER = postmaster@mail.com
SMTP_PASS = dc3ad6lkrrZ-SMTPPassword-e3iicl60sxhh
SMTP_FROM_ADDRESS = support@mail.com
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
