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
import { FindOneDto } from 'src/shared/dtos/one.dto';
import { ColumnsService } from './columns.service';
import { AddColumnDto, ColumnDto } from './dtos/column.dto';

@ApiTags('columns')
@Controller('columns')
export class ColumnsController {
  constructor(private columnsService: ColumnsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Add new column',
  })
  @ApiBearerAuth()
  addColumn(@Body() column: AddColumnDto): Promise<ColumnDto> {
    return this.columnsService.addColumn(column);
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Update existing column',
  })
  @ApiBearerAuth()
  async updateColumn(@Body() column: ColumnDto): Promise<void> {
    await this.columnsService.updateColumn(column);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Update existing column',
  })
  @ApiBearerAuth()
  async deleteColumn(@Param() { id }: FindOneDto): Promise<void> {
    await this.columnsService.deleteColumn(id);
  }
}
