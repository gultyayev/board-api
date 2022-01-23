import { IsUUID } from 'class-validator';

export class FindOneDto {
  @IsUUID()
  id: string;
}
