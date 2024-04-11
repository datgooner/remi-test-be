# Funny videos - BE - Remitano examination

## Introduction

This project serves as a platform for users to share their favorite videos from YouTube. It includes a favorite board where users can view others' shared videos. Once logged in, users can share videos, and every other logged-in user will receive notifications when a new video is shared.

This project is a BE part of web application built with those tech stacks:

- NestJS, TypeScript
- MongoDb with Mongoose
- @nestjs/passport for authentication
- Socket io
- Eslint, Prettier config
- Husky, Lint-staged

- Jest, mongodb-memory-server
- Docker, and deployed on [railway](https://railway.app/)

## Demo

Check out the [demo](https://remi-funny-videos.vercel.app/) to see the platform in action!
Check out the [health check endpoint](https://remi-test-be-production.up.railway.app/api/v1/health)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (version >= 18)
- yarn
- Docker (optional)

## Installation & Configuration

To install and configure the project, follow these steps:

```bash
# Clone the repository:

   git clone https://github.com/datgooner/remi-test-be
   cd remi-test-be

# Install dependencies:

   yarn install
```

# Database Setup

The project is using mongoDB. You can create your free database [here](https://www.mongodb.com/atlas/database), or using local database. Save your database uri to some place.

## Environment variables

Copy example.env to .env or .env.local

There are some field you must setup by yourself:

  **Database**
Replace MONGO_DBURI with your database uri

  **JWT**
Replace JWT_SECRET as your secret key
JWT_TOKEN_EXPIRY is the expiry time of token in second

  **Youtube data api key**
The project is using Youtube data api to get the video data. You need to setup your API key, follow this [guideline](https://developers.google.com/youtube/v3/getting-started). After that, replace YOUTUBE_API_KEY with your key

## Running the Application

We have two choices to run the application on the local development

### yarn

```bash
# development
    yarn start

# watch mode
    yarn dev
```
### docker

We have setup a optimized docker file for development, to use it, start your docker instance, follow this step:

   **Start docker compose:**

```bash
   docker compose up
```

## Test

```bash
# unit tests
    yarn test

# e2e tests
    yarn test:e2e

# test coverage
    yarn test:cov
```

## Deployment

I'm using [railway](https://railway.app/) as a free hosting for this project. The config file is located in railway.toml. It's currently using docker setup.

Wanna use other platform?

  **Using docker build command**

```bash
    docker build . -t <your-container-name>:<version>
```

Replace 'your-container-name' and 'version' with the name and version you want.

## Usage

Accessing home page, you can see a shared videos board. 
You can easily get the video information like video title, video description, author name (who shared this video),...
To see more videos, just scroll down...

To use the sharing function, let's use our login/register function first. 

You must enter a valid email and a password that has at least 8 characters. We don't use complicate validation here.
If your email was used to register before, please enter correct password. Otherwise, just enter your new email and password, you will be automatically signed in and logged in. 

After logged in, click to the Share a movie button on the header, you will be redirect to the sharing page. Enter your favorite video's url here. We accept both https://www.youtube.com/* and https://youtu.be/* format. Share your video, and boom...it's gonna come to the new feed. BTW, other people will get a notification about your shared video. Interested!

## Troubleshooting

Found any issue? Please let me know.