import { IsString } from 'class-validator';

export class AuthTokenDto {
  @IsString()
  client_id: string;

  @IsString()
  client_secret: string;
  
  @IsString()
  grant_type: string;
  
  @IsString()
  code: string;
  
  @IsString()
  redirect_uri: string;
}