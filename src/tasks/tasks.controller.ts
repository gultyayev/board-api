import {
  Body,
  Controller,
  Delete,
  NotFoundException,
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
  constructor(
    private tasksService: TasksService,
    private columnsService: ColumnsService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Add new task',
  })
  @ApiBearerAuth()
  addTask(@Body() task: AddTaskDto): TaskDto {
    if (!this.columnsService.hasColumn(task.columnId)) {
      throw new NotFoundException('Column does not exist');
    }

    return this.tasksService.addTask(task);
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Update task',
  })
  @ApiBearerAuth()
  updateTask(@Body() task: TaskDto): void {
    if (!this.tasksService.hasTask(task.id)) {
      throw new NotFoundException();
    }

    if (!this.columnsService.hasColumn(task.columnId)) {
      throw new NotFoundException('Column does not exist');
    }

    this.tasksService.updateTask(task);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Delete task',
  })
  @ApiBearerAuth()
  deleteTask(@Param() { id }: FindOneDto): void {
    if (!this.tasksService.hasTask(id)) {
      throw new NotFoundException();
    }

    this.tasksService.deleteTask(id);
  }

  @Put('reorder')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Reorder tasks',
  })
  @ApiBearerAuth()
  reorderTasks(@Body() taskList: ReorderTasksDto): void {
    taskList.ids.forEach((id) => {
      if (!this.tasksService.hasTask(id)) {
        throw new NotFoundException();
      }
    });

    this.tasksService.reorderTasks(taskList);
  }
}
