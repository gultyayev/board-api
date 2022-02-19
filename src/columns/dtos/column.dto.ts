import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsUUID, MinLength } from 'class-validator';
import { TaskDto } from 'src/tasks/dtos/task.dto';

export class AddColumnDto {
  @IsString()
  @MinLength(3)
  title: string;
}

export class UpdateDto extends AddColumnDto {
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
}
