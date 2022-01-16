import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AddTaskDto, TaskDto } from './dtos/task.dto';

const tasks: TaskDto[] = [];

@Injectable()
export class TasksService {
  addTask(task: AddTaskDto): TaskDto {
    const newTask = {
      id: randomUUID(),
      ...task,
    };
    tasks.push(newTask);
    return newTask;
  }

  getTasks(): TaskDto[] {
    return tasks;
  }
}
