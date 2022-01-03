import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateInnerProxyDto {
  @IsNotEmpty()
  @IsString()
  username: string;
  @IsNotEmpty()
  @IsString()
  password: string;
  @IsNotEmpty()
  @IsString()
  host: string;
  @IsNotEmpty()
  @IsNumber()
  port: number;
}
