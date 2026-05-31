import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateCashierDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;
}
