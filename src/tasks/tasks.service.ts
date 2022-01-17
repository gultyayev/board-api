import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import { AddTaskDto, ReorderTasksDto, TaskDto } from './dtos/task.dto';

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

  hasTask(id: string): boolean {
    return !!this.tasks.find((t) => t.id === id);
  }

  updateTask(task: TaskDto): void {
    const idx = this.tasks.findIndex((t) => t.id === task.id);
    this.tasks[idx] = task;
    this.writeTasks();
  }

  reorderTasks(taskList: ReorderTasksDto): void {
    taskList.ids.forEach((id) => {
      const taskIdx = this.tasks.findIndex((task) => task.id === id);
      this.tasks.push(...this.tasks.splice(taskIdx, 1));
    });
    this.writeTasks();
  }

  getTasks(): TaskDto[] {
    return this.tasks;
  }

  private writeTasks(): void {
    writeFileSync(path, JSON.stringify(this.tasks), { encoding: 'utf-8' });
  }
}
