<br>
<p align="center">
<img src="https://nestjs.com/img/logo_text.svg" width="80">
</p>

<p align="center">Project built with NestJS Framework.</p>

## Description
This project implements a new social media application. it's very similar to Twitter, but it has far fewer features:
- [x] Post creation: for posting, reposting and quoting a post;
- [x] Post listing, with or without filters: by user, date range, page, quantity to be retrivied
- [X] User profile details listing

🔗 At the [Notes.md](./Notes.md) file there are more details about these features.

## Environment variables

Create a file `.env` file at the project's root and define these environment variables before start this project


```diff
+ APP_NAME=POOR-TWITTER <- this will be the name of the database

NODE_ENV=dev
APP_VERSION=1.0.0
APP_PORT=22200
APP_DEBUGGER_PORT=22300

+ DB_DRIVER=mysql  <- don't need to change
+ DB_HOST=database <- don't need to change
DB_ROOT_PASSWORD=banana pijama
DB_USER=docker
DB_PASSWORD=banana pijama

POST_DAILY_LIMIT=5
PAGE_SIZE=10
```

## Deps Installation

The project is using yarn to manage the dependencies.

```bash
$ yarn install
```

## Available commands to run the app

These are the available commands that should be used at the right environment.

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod

```

### Running with Docker Compose
```bash
# there is a docker-compose.dev.yml for development purposes only
$ docker-compose -f docker-compose.dev.yml up

# for prune purposes this command will clean all related contained, image and volume for this project only
$ docker-compose -f docker-compose.dev.yml down -v --rmi all
```

### Initial Setup

We need to run our migrations and add a user to the database.

```bash
# creates the database and run the migrations
$ yarn db:create
```

Access the database with the credentials provided at the `.env` file.

As host use `localhost:3306` to access the docker container externally

```sql
  INSERT INTO POOR_TWITTER.users (id, uuid, username, createdAt, updatedAt) VALUES(NULL, '46012ff7-f552-438f-9017-7041d6bc7ada', 'gunter01', NULL, NULL);
```

## Testing

The project have End-To-End tests implemented that checks all the features workflow as a consumer client would do.

You should run the command bellow inside the docker container if you are running with Docker Compose.

```bash
# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

#### Available Endpoints

[Here is a Postman collection](https://www.postman.com/speeding-eclipse-658927/workspace/public-workspace/request/8697812-9ed08f63-0e7f-4617-8e1d-6b059aa43031) that can help you to consume the available REST endpoints:

- [x] `(POST) /v1/posts`
- [x] `(GET) /v1/posts`
- [x] `(GET) /v1/users/:uuid`


## Technical Details


**DDD** has been implemented. Adopting modules and each of the had its `Application` and `Domain` layers. Also, a `Shared` layer is available with resources that can be used for each layer.

Inside the domain exists a  **Command** layer that process the bussiness logic implementation.

Also, there is a **Repository** layer provided by TypeORM that works with our domain entities, Post and User, to manage the database operations easily.

Endpoint data **validations** are made automatically by applied **DTO classes** to the controller's methods's signatures, preventing unwanted / invalid values to be processed.


#### Database choosen

The SQL kind database was choosen due to the nature of those domain relationships. That some post belongs to some user, and posts can referenced by another quotes / reposts. This relations can be easily constructed with SQL databases.

## 🚩 Critique

#### Improvements

If I had extra time to work on this:
- [ ] I would like to make more security tests with automated tools to try to indentify OWASP top 10 treats;
- [ ] Implement a Resource layer to control the data of the endpoints and avoid data unwanted data leak;
- [ ] Transform the pagination calcs into a middleware to avoid duplicated code in the next paginated feature;
- [ ] Review some contracts that may be useful to exists as a common base contract or at the shared folder;
- [ ] Maybe use NestJS's subscribers or the database itself to auto-generate Uuids;
- [ ] Solve some known bugs with datasource.ts, configService module and database seeders;

#### Escalability

This project has been prepared in a microsservice structure, the type of app configuration was planned to work with microsservices archtecture, as NestJS hybrid application, that receives and send data among other services.

However, some another steps should be taken to have a  complete microsservices archtecture implemented.

By example, the project doesn't have yet queues to process communications from and to another services.

Considering the Docker's mounted environment, the actual configuration can manage a large amount of data. But for a massive adoption, **creation and listing feature could have a overload problem** due to the project have a single container for the Database and the API.

To solve this, an horizontal auto-scaling is necessary with some of tweaks at the context of database read-replicas.

Also, some cache layer would be great to improve the API performance and could be applied by a Proxy service or a Redis implemented at the project App.
