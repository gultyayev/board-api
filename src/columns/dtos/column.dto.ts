import { IsString, IsUUID, MinLength } from 'class-validator';

export class AddColumnDto {
  @IsString()
  @MinLength(3)
  title: string;
}

export class ColumnDto extends AddColumnDto {
  @IsUUID()
  id: string;
}
