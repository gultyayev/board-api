import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { dynamoDB } from 'src/db';
import { COLUMNS_TABLE } from 'src/env';
import { AddTaskDto, ReorderTasksDto, TaskDto } from './dtos/task.dto';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  async addTask(task: AddTaskDto): Promise<TaskDto> {
    const newTask = {
      id: randomUUID(),
      ...task,
    };

    try {
      await dynamoDB
        .update({
          TableName: COLUMNS_TABLE,
          Key: {
            id: task.columnId,
          },
          UpdateExpression: 'SET #t = list_append(#t, :vals)',
          ExpressionAttributeNames: {
            '#t': 'tasks',
          },
          ExpressionAttributeValues: {
            ':vals': [newTask],
            ':id': newTask.columnId,
          },
          ConditionExpression: 'id = :id',
        })
        .promise();
    } catch (e) {
      if (e.code === 'ConditionalCheckFailedException') {
        throw new NotFoundException('Column does not exist');
      } else {
        this.logger.error(e, e.stack);

        throw new InternalServerErrorException();
      }
    }

    return newTask;
  }

  async deleteTask(id: string): Promise<void> {
    try {
      const { column, taskIdx } = await this.getColumnByTaskID(id);

      await dynamoDB
        .update({
          TableName: COLUMNS_TABLE,
          Key: { id: column.id },
          UpdateExpression: `REMOVE tasks[${taskIdx}]`,
          ExpressionAttributeValues: {
            ':id': column.id,
          },
          ConditionExpression: 'id = :id',
        })
        .promise();
    } catch (e) {
      if (e.code === 'ConditionalCheckFailedException') {
        throw new NotFoundException('Column does not exist');
      } else {
        this.logger.error(e, e.stack);

        throw new InternalServerErrorException();
      }
    }
  }

  async updateTask(task: TaskDto): Promise<void> {
    try {
      const { column, taskIdx } = await this.getColumnByTaskID(task.id);

      await dynamoDB
        .update({
          TableName: COLUMNS_TABLE,
          Key: { id: column.id },
          UpdateExpression: `SET tasks[${taskIdx}] = :task`,
          ExpressionAttributeValues: {
            ':task': task,
            ':id': column.id,
          },
          ConditionExpression: 'id = :id',
        })
        .promise();
    } catch (e) {
      if (e.code === 'ConditionalCheckFailedException') {
        throw new NotFoundException();
      } else {
        this.logger.error(e, e.stack);

        throw new InternalServerErrorException();
      }
    }
  }

  async reorderTasks(taskList: ReorderTasksDto): Promise<void> {
    try {
      const { column } = await this.getColumnByTaskID(taskList.ids[0]);
      taskList.ids.forEach((id) => {
        const taskIdx = column.tasks.findIndex((task) => task.id === id);

        if (taskIdx < 0) {
          throw new NotFoundException();
        }

        column.tasks.push(...column.tasks.splice(taskIdx, 1));
      });

      await dynamoDB
        .update({
          TableName: COLUMNS_TABLE,
          Key: { id: column.id },
          UpdateExpression: 'SET tasks = :tasks',
          ExpressionAttributeValues: {
            ':tasks': column.tasks,
            ':id': column.id,
          },
          ConditionExpression: 'id = :id',
        })
        .promise();
    } catch (e) {
      if (e.code === 'ConditionalCheckFailedException') {
        throw new NotFoundException();
      } else {
        this.logger.error(e, e.stack);

        throw new InternalServerErrorException();
      }
    }
  }

  private async getColumnByTaskID(id: string) {
    const result = await dynamoDB
      .scan({
        TableName: COLUMNS_TABLE,
      })
      .promise();

    let taskIdx: number;
    const column = result.Items.find((column) =>
      column.tasks.find((task, index) => {
        if (task.id === id) {
          taskIdx = index;
          return true;
        }
      }),
    );

    if (taskIdx < 0) {
      throw new NotFoundException();
    }

    return {
      column,
      taskIdx,
    };
  }
}
