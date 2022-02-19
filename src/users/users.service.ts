import { Injectable, Logger } from '@nestjs/common';
import { randomUUID, scrypt } from 'crypto';
import { dynamoDB } from 'src/db';
import { SALT, USERS_TABLE } from 'src/env';
import { promisify } from 'util';

const scriptPromise = promisify(scrypt);

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  async validateUser(username: string, password: string): Promise<boolean> {
    this.logger.verbose(`Check user is valid "${username}"`);

    const result = await dynamoDB
      .query({
        TableName: USERS_TABLE,
        ConsistentRead: true,
        FilterExpression: 'password = :pw',
        KeyConditionExpression: 'username = :us',
        ExpressionAttributeValues: {
          ':us': username,
          ':pw': await this.getHash(password),
        },
        ReturnConsumedCapacity: 'TOTAL',
      })
      .promise();

    this.logger.verbose(
      `Check user is valid "${username}" = "${result.Count === 1}"`,
    );

    return result.Count === 1;
  }

  async hasUser(username: string): Promise<boolean> {
    this.logger.verbose(`Check has user = "${username}"`);

    const result = await dynamoDB
      .get({
        TableName: USERS_TABLE,
        ConsistentRead: true,
        Key: {
          username,
        },
        AttributesToGet: ['id'],
        ReturnConsumedCapacity: 'TOTAL',
      })
      .promise();

    this.logger.verbose(`Check has user "${username}" = "${!!result.Item}"`);

    return !!result.Item;
  }

  async addUser(username: string, password: string): Promise<void> {
    this.logger.verbose(`Add user "${username}"`);

    const user = {
      id: randomUUID(),
      username,
      password: await this.getHash(password),
      createdAt: new Date().toISOString(),
    };

    await dynamoDB
      .put({
        TableName: USERS_TABLE,
        Item: user,
      })
      .promise();

    this.logger.verbose(`User created "${username}"`);
  }

  private async getHash(password: string): Promise<string> {
    const buffer = await scriptPromise(password, SALT, 24);
    return buffer.toString();
  }
}
