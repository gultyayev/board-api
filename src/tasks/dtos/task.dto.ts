import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class AddTaskDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(3)
  @MaxLength(4000)
  description: string;

  @IsUUID()
  columnId: string;
}

export class TaskDto extends AddTaskDto {
  @IsUUID()
  id: string;
}

export class ReorderTasksDto {
  @IsUUID('4', {
    each: true,
  })
  ids: string[];
}
