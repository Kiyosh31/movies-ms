# Overview

This is a learn project of `nestjs` microservices, about an online movie store

# Project Installation

## Pre-requisites

1. Docker
2. Node.js (v20.11.1)

## Steps

1. Clone the repo

```console
git clone git@github.com:Kiyosh31/movies-ms.git
```

2. Install dependencies (on root folder)

```console
npm i
```

3. Run Project

```
make dev
```

# Commands

### Makefile

1. `make clean` This command cleans all docker images, volumes, containers, etc

2. `make dev` This command runs the project in docker compose

### Npm

1. `npm run proto:users` this will generate a protobuf file for users microservice

# Nestjs Commands

1. Generate a new microservice

```console
nest g app <app name>
```

2. Generate `controllers` and `Services` inside Gateway

```console
nest g resource <resource name>
```
