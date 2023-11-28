import { IsString } from 'class-validator';

export class PersonDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;
}