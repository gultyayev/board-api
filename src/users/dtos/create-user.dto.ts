import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(255)
  readonly username: string;
  @IsString()
  @MinLength(3)
  readonly password: string;
}
