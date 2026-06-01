import { IsString, MinLength } from 'class-validator';

export class UpdateCashierPasswordDto {
  @IsString()
  @MinLength(6)
  password: string;
}
