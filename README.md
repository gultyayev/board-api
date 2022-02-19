# Board API

This project is created to help newcomers to front-end to learn working with back-end servers.

Board API provides an API for creating a Scrum board. It allows to work with columns and tasks.
OpenAPI documentations is exposed on `/api` endpoint.

The server can be run as locally as remotely by deploying to AWS using Serverless framework.
The project is supposed to fall under Free Tier/Always Free Tier resources (to avoid payment for pet project).

After 12 month of AWS Free Tier you will be chared for S3 Bucket resource, though the charge should be low you can always remove all created resources (see "Remove the service" section).

This is not a production ready project, so don't put in any sensitive data as it may be exposed.

## Prerequisites

1. Have Serverless Framework installed globally `npm install -g serverless`
2. Have [AWS CLI](https://aws.amazon.com/cli/) configured `aws configure`
3. (Optional) For running locally JDK should be installed

## Setup

1. `git clone https://github.com/gultyaev/board-api.git`
2. `cd board-api`
3. `npm i`

## Testing locally

At first time run `sls dynamodb install`.

Then start the local server `npm run sls:offline`.

## Deployment

`npm run sls:deploy` will create all resources (CloudFormation stack, S3 bucket, Lambda, DynamoDB) and print the URL to the service in the console.

## Remove the service

`sls remove` will remove all resources.
