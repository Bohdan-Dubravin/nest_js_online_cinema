import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  minLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;
}
