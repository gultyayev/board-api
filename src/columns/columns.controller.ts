import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ColumnsService } from './columns.service';
import { AddColumnDto, ColumnDto } from './dtos/column.dto';

@ApiTags('columns')
@Controller('columns')
export class ColumnsController {
  constructor(private columnsService: ColumnsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all columns',
  })
  getAllColumns(): ColumnDto[] {
    return this.columnsService.getColumns();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Add new column',
  })
  @ApiBearerAuth()
  addColumn(@Body() column: AddColumnDto): void {
    this.columnsService.addColumn(column);
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
}
