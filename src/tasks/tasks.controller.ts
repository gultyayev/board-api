import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ColumnsService } from 'src/columns/columns.service';
import { FindOneDto } from 'src/shared/dtos/one.dto';
import { AddTaskDto, ReorderTasksDto, TaskDto } from './dtos/task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
@ApiTags('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Add new task',
  })
  @ApiBearerAuth()
  async addTask(@Body() task: AddTaskDto): Promise<TaskDto> {
    return this.tasksService.addTask(task);
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Update task',
  })
  @ApiBearerAuth()
  async updateTask(@Body() task: TaskDto): Promise<void> {
    await this.tasksService.updateTask(task);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Delete task',
  })
  @ApiBearerAuth()
  async deleteTask(@Param() { id }: FindOneDto): Promise<void> {
    await this.tasksService.deleteTask(id);
  }

  @Put('reorder')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Reorder tasks',
  })
  @ApiBearerAuth()
  async reorderTasks(@Body() taskList: ReorderTasksDto): Promise<void> {
    await this.tasksService.reorderTasks(taskList);
  }
}
