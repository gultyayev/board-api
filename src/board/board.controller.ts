import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { BoardItemDto } from './dtos/board-item.dto';

@Controller('board')
export class BoardController {
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  getAll(): BoardItemDto[] {
    return [
      {
        id: '1',
        title: 'test',
        body: 'test',
        createdAt: new Date().toISOString(),
      },
    ];
  }
}
