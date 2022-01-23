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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { FindOneDto } from 'src/shared/dtos/one.dto';
import { TasksService } from 'src/tasks/tasks.service';
import { ColumnsService } from './columns.service';
import { AddColumnDto, ColumnDto } from './dtos/column.dto';

@ApiTags('columns')
@Controller('columns')
export class ColumnsController {
  constructor(
    private columnsService: ColumnsService,
    private tasksService: TasksService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Add new column',
  })
  @ApiBearerAuth()
  addColumn(@Body() column: AddColumnDto): ColumnDto {
    return this.columnsService.addColumn(column);
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Update existing column',
  })
  @ApiBearerAuth()
  updateColumn(@Body() column: ColumnDto): void {
    this.columnsService.updateColumn(column);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Update existing column',
  })
  @ApiParam({
    type: 'string',
    format: 'uuid',
    name: 'id',
  })
  @ApiBearerAuth()
  deleteColumn(@Param() { id }: FindOneDto): void {
    if (!this.columnsService.hasColumn(id)) {
      throw new NotFoundException();
    }

    this.columnsService.deleteColumn(id);
    this.tasksService.deleteTasksByColId(id);
  }
}
