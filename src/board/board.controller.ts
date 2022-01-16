import { Controller, Get } from '@nestjs/common';
import { ColumnsService } from 'src/columns/columns.service';
import { ColumnDto } from 'src/columns/dtos/column.dto';
import { TaskDto } from 'src/tasks/dtos/task.dto';
import { TasksService } from 'src/tasks/tasks.service';
import { BoardDto } from './dtos/board-item.dto';

@Controller('board')
export class BoardController {
  constructor(
    private columnsService: ColumnsService,
    private tasksService: TasksService,
  ) {}

  @Get()
  getAll(): BoardDto {
    const columns: ColumnDto[] = this.columnsService.getColumns();
    const tasks: TaskDto[] = this.tasksService.getTasks();

    return {
      columns,
      tasks,
    };
  }
}
