import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsISO8601,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { TaskDto } from 'src/tasks/dtos/task.dto';

export class AddColumnDto {
  @IsString()
  @MinLength(3)
  title: string;
}

export class UpdateColumnDto extends AddColumnDto {
  @IsUUID()
  id: string;
}

export class ColumnDto extends AddColumnDto {
  @IsUUID()
  id: string;

  @ApiProperty({
    type: [TaskDto],
  })
  @IsArray()
  tasks: TaskDto[];

  @IsISO8601()
  createdAt: string;
}
