<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
<p align="center">

## Description

# Content Management System (CMS)

## Overview
The Content Management System (CMS) is a application that simplifies the process of managing, publishing, and distributing posts online for companies.

## Features
**Company Registration:**
   - Easy registration process for companies to establish their presence on the platform.

**Customer Registration:**
   - User-friendly customer registration with personalized accounts.

**Role Management:**
   - Assign different roles to customers for customized access and permissions.

**Post Distribution:**
   - Publish and distribute posts online, with flexible rights management.

**Authorization and Password Recovery:**
   - Secure authorization and password recovery mechanisms for user convenience.

**Administrator Privileges:**
   - Admins can reset passwords for all users to enhance account security.

**Two-Factor Authentication (2FA):**
   - Additional layer of security with 2FA for customer accounts.

**Customized Access Policies:**
   - Define policies allowing certain customers to access all company posts.

**Token Management:**
   - Refresh tokens for secure and continuous access for registered customers.

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

# docker compose
$ docker compose up
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