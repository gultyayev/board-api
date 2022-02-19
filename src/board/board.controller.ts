import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ColumnsService } from 'src/columns/columns.service';
import { ColumnDto } from 'src/columns/dtos/column.dto';
import { BoardDto } from './dtos/board-item.dto';

@Controller('board')
@ApiTags('board')
export class BoardController {
  constructor(private columnsService: ColumnsService) {}

  @Get()
  async getAll(): Promise<BoardDto> {
    const columns: ColumnDto[] = await this.columnsService.getColumns();

    return {
      columns,
    };
  }
}
