import { DynamoDB } from 'aws-sdk';
import { DYNAMODB_ENDPOINT, IS_OFFLINE } from './env';

let db;

if (IS_OFFLINE === 'true') {
  db = new DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: DYNAMODB_ENDPOINT,
  });
} else {
  db = new DynamoDB.DocumentClient();
}

export const dynamoDB: DynamoDB.DocumentClient = db;
