import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import { AddTaskDto, TaskDto } from './dtos/task.dto';

const path = 'tasks.json';

@Injectable()
export class TasksService {
  tasks: TaskDto[] = [];

  constructor() {
    const tasks: string = readFileSync(path, {
      encoding: 'utf-8',
      flag: 'a+',
    });

    if (tasks) {
      const obj = JSON.parse(tasks) || [];
      this.tasks = obj;
    }
  }

  addTask(task: AddTaskDto): TaskDto {
    const newTask = {
      id: randomUUID(),
      ...task,
    };
    this.tasks.push(newTask);
    this.writeTasks();
    return newTask;
  }

  getTasks(): TaskDto[] {
    return this.tasks;
  }

  private writeTasks(): void {
    writeFileSync(path, JSON.stringify(this.tasks), { encoding: 'utf-8' });
  }
}
