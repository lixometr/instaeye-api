import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateInnerAccountDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  emailPassword?: string;

  @IsOptional()
  @IsString()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  proxy: string;
}
