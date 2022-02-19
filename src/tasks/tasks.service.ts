import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AddTaskDto, ReorderTasksDto, TaskDto } from './dtos/task.dto';

@Injectable()
export class TasksService {
  tasks: TaskDto[] = [];

  constructor() {}

  addTask(task: AddTaskDto): TaskDto {
    const newTask = {
      id: randomUUID(),
      ...task,
    };
    this.tasks.push(newTask);
    return newTask;
  }

  hasTask(id: string): boolean {
    return !!this.tasks.find((t) => t.id === id);
  }

  deleteTask(id: string): void {
    this.tasks = this.tasks.filter((t) => t.id !== id);
  }

  updateTask(task: TaskDto): void {
    const idx = this.tasks.findIndex((t) => t.id === task.id);
    this.tasks[idx] = task;
  }

  reorderTasks(taskList: ReorderTasksDto): void {
    taskList.ids.forEach((id) => {
      const taskIdx = this.tasks.findIndex((task) => task.id === id);
      this.tasks.push(...this.tasks.splice(taskIdx, 1));
    });
  }

  deleteTasksByColId(columnId: string): void {
    this.tasks = this.tasks.filter((task) => task.columnId !== columnId);
  }

  getTasks(): TaskDto[] {
    return this.tasks;
  }
}
