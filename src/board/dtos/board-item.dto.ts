import { ColumnDto } from 'src/columns/dtos/column.dto';
import { TaskDto } from 'src/tasks/dtos/task.dto';

export class BoardDto {
  columns: ColumnDto[];
  tasks: TaskDto[];
}
