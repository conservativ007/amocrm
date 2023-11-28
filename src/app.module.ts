import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonModule } from './person/person.module';
import { Oauth2Module } from './oauth2/oauth2.module';

@Module({
  imports: [PersonModule, Oauth2Module],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
