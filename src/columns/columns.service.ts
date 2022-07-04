import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { dynamoDB } from 'src/db';
import { COLUMNS_TABLE } from 'src/env';
import { AddColumnDto, ColumnDto, UpdateColumnDto } from './dtos/column.dto';

@Injectable()
export class ColumnsService {
  private readonly logger = new Logger(ColumnsService.name);

  async getColumns(): Promise<ColumnDto[]> {
    this.logger.verbose('Get all columns');

    const result = await dynamoDB
      .scan({
        TableName: COLUMNS_TABLE,
      })
      .promise();

    this.logger.verbose('Result', result);

    return (
      (result.Items as any).sort((a, b) => {
        const res =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

        if (res > 0) {
          return 1;
        } else if (res < 0) {
          return -1;
        } else {
          return 0;
        }
      }) || []
    );
  }

  async addColumn({ title }: AddColumnDto): Promise<ColumnDto> {
    this.logger.verbose('Add column');

    const col: ColumnDto = {
      id: randomUUID(),
      title,
      tasks: [],
      createdAt: new Date().toISOString(),
    };

    await dynamoDB
      .put({
        TableName: COLUMNS_TABLE,
        Item: col,
      })
      .promise();

    this.logger.verbose('Column added', col);

    return col;
  }

  async updateColumn({ id, title }: UpdateColumnDto): Promise<void> {
    try {
      await dynamoDB
        .update({
          TableName: COLUMNS_TABLE,
          Key: {
            id,
          },
          UpdateExpression: 'SET title = :title',
          ExpressionAttributeValues: {
            ':title': title,
            ':id': id,
          },
          ConditionExpression: 'id = :id',
        })
        .promise();
    } catch (e) {
      if (e.code === 'ConditionalCheckFailedException') {
        throw new NotFoundException();
      } else {
        this.logger.error(e);

        throw new InternalServerErrorException();
      }
    }
  }

  async hasColumn(id: string): Promise<boolean> {
    const result = await dynamoDB
      .get({
        TableName: COLUMNS_TABLE,
        Key: { id },
      })
      .promise();

    return !!result.Item;
  }

  async deleteColumn(id: string): Promise<void> {
    try {
      await dynamoDB
        .delete({
          TableName: COLUMNS_TABLE,
          Key: { id },
        })
        .promise();
    } catch (e) {
      if (e.code === 'ConditionalCheckFailedException') {
        throw new NotFoundException();
      } else {
        this.logger.error(e);

        throw new InternalServerErrorException();
      }
    }
  }
}
