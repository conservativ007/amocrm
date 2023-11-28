import { Body, Controller, Post } from '@nestjs/common';
import { AuthTokenDto } from './dto/auth.dto';


@Controller('oauth2')
export class Oauth2Controller {
  @Post('access_token')
  async amocrm(@Body() dto: AuthTokenDto) {
    console.log(dto)
  }
}
