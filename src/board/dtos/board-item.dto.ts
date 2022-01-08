import { ApiProperty } from '@nestjs/swagger';

export class BoardItemDto {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
  })
  id: string;
  title: string;
  body: string;
  createdAt: string;
}
