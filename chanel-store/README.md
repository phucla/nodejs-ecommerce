# Chanel Store

The backend application expose backend API for Chanel Store

## Document

[Chanel Store document](https://docs.google.com/document/d/1TQQ6qeTTGlkGxXFnA_dZZiwYjtdRu-X9JwTfLya7bjk/edit?usp=sharing)

## Task Management

Use [Trello](https://trello.com/b/G6qZfbDk) to management task and this is a private board

## Technical Stack

[Technical Stack document](https://docs.google.com/document/d/1VBxi8sDsSnaewY44YayFyhxyvpYFnNemzCCJJcniDGc/edit?usp=sharing)

### Languages

- [Typescript 4.0.5](https://www.typescriptlang.org/) - This is a typed superset of Javascript that compiles ti plain Javascript

### Frameworks

- [NestJS 7.5.0](https://nestjs.com/) - NestJS is a progressive Node.js framework for building efficient, scalable, and enterprise-grade server-side applications on top of TypeScript & JavaScript (ES6, ES7, ES8)

### Tools and Libs

- [PostgreSQL](https://www.postgresql.org) - PostgreSQL is an open-source relational database management system ( DBMS ) developed by a worldwide team of volunteers. PostgreSQL is not controlled by any corporation or other private entity and the source code is available free of charge
- Coverage - Report coverage of unit testing
- [Seeder](https://developer.aliyun.com/mirror/npm/package/nestjs-seeder) - Initialize fake data

## Development Environment

### Create environment dot file

**Create dot file**

- Create dot file environment with format name file: `.env.{ENVIRONMENT}`, eg: `.env.local`, `.env.test`, etc ...

**Update value for dot file**

- Follow content of file `.env.sample` and update value mapping with environment configurations.

### How to run

**Source bash file to load helper scripts**

```
source bin/activate.sh
```

**_1. Admin portal app_**

`do-admin-start` Run app server and go to [http://localhost:3000/]

`do-admin-build` Build admin portal app from TS to JS.

`do-admin-linting` Check code style for admin portal.

`do-admin-test` Run unit test for admin portal.

`do-admin-portal-deploy` Deploy admin portal.

**_2. Store manager portal app_**

`do-store-start` Run app server and go to [http://localhost:3002/].

`do-store-build` Build store portal app from TS to JS.

`do-store-linting` Check code style for store portal.

`do-store-portal-test` Run unit test for store portal.

`do-store-portal-deploy` Deploy store portal.

**_3. Customer portal app_**

`do-customer-start` Run app server and go to [http://localhost:3001/].

`do--customer-build` Build support portal app from TS to JS.

`do--customer-linting` Check code style for support portal.

`do-support-portal-test` Run unit test for support portal.

`do-support-portal-deploy` Deploy support portal.

**_4. Seeding_**

(TBD)
