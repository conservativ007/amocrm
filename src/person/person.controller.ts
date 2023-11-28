import { Body, Controller, Get, HttpCode, Req } from '@nestjs/common';
import { PersonDto } from './dto/person.dto';
import { Request } from 'express';
import { PersonService } from './person.service';

@Controller('person')
export class PersonController {

  constructor(private personService: PersonService) {}

  @HttpCode(200)
  @Get()
  async create(@Body() dto: PersonDto) {
    await this.personService.updateToken();

    const response = await this.personService.checkContact(dto);
    const contact = await this.personService.createContact(dto, response);
    await this.personService.createDealWithContact(contact.id);
  }
}
