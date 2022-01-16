import {
  Body,
  Controller,
  NotFoundException,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ColumnsService } from 'src/columns/columns.service';
import { AddTaskDto, TaskDto } from './dtos/task.dto';
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
}
