# Tasktime Server

The tasktime backend service provides a REST API with validation, authentication and authorization for the tasktime app.

## Some of the tech and packages used

The full list of packages used can be seen in the [package.json](https://github.com/jayelg/tasktime-server/blob/main/package.json) file.

written in [Typescript](https://www.typescriptlang.org/)

[Nest js](https://www.passportjs.org/packages/passport-magic-login/) - module based backend Node.js framework providing modules for express js, jest, jwt, class-validator, mailer, among others.

[Passport with magic login](https://www.passportjs.org/packages/passport-magic-login/) - Passwordless authentication using magic links sent to users email address.

[Handlebars](https://handlebarsjs.com/) - Templating lanugage to dynamicly generate static html/css. Used to send email sign-in links, notifications etc.

[Maizzle](https://maizzle.com) - Framework for creating HTML/CSS packages using tailwindCSS. This is configured to generate handlebars templates

[Mongoose](https://mongoosejs.com/) - MongoDB

[Swagger](https://mongoosejs.com/) - API Documentation

## First Prototype

I initially started building this using express js which can be viewed at the following branch of this repo.

[Express branch](https://github.com/jayelg/tasktime-server/tree/express)

## Running the server

Ensure Node.js and npm package manager is installed.

Pull the project from git.

create a .env file in the root directory of the project with the following parameters.

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

Use of of the following commands to run the server.

```bash
# dev mode watching for changes
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
