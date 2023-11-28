import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { data } from "../../data";
import { PersonDto } from './dto/person.dto';
import { Contact } from './types/contact';
import { UserDataCustomFieldsExist } from './types/email_phone';

@Injectable()
export class PersonService {

  async updateToken() {
    const apiUrl = "https://alisa3d2007.amocrm.ru/oauth2/access_token";

    const clientData = {
      "client_id": "bf0ab249-edeb-4482-8503-6d9961eab728",
      "client_secret": "w9SeFieEBD7QcMSLCTH5HxHeKXkKhF58b7HhbehPRDXZ9gm1it69igrKSLRRToTs",
      "grant_type": "refresh_token",
      "refresh_token": `${data.refresh_token}`,
      "redirect_uri": "https://faf2-178-121-38-21.ngrok-free.app"
    }

    try {
      const tokenResponse: AxiosResponse<any> = await axios.post(apiUrl, clientData);
      data.setAccessToken(tokenResponse.data.access_token);

    } catch (error) {
      console.log(error);
    }
  }

  async checkPersonData(arrayOfContacts: [], searchField :string, fieldId: number) {
    const valueIsExist = arrayOfContacts.some((contact: Contact) => {
      if (contact.custom_fields_values) {
        // проверка на существование телефонного поля
        const phoneField = contact.custom_fields_values.find(field => field.field_id === fieldId);
    
        if (phoneField && phoneField.values) {
          // проверка на совпадение поле value с dto.phone или dto.email
          return phoneField.values.some(value => value.value === searchField);
        }
      }
    
      return false;
    });

    return valueIsExist;
  }

  async findUserId(arrayOfContacts: Contact[], dto: PersonDto) {
    const contactWithMatchingValue = arrayOfContacts.find((contact) =>
      contact.custom_fields_values?.some(
        (field) =>
          field.values?.some(
            (value) => (value.value === dto.phone || value.value === dto.email) && (field.field_id ?? null)
          )
      )
    );
    return contactWithMatchingValue.id;
  }

  async updateContact(dto: PersonDto) {
    const headers = {
      Authorization: `Bearer ${data.access_token}`,
    };
    const apiUrl = "https://alisa3d2007.amocrm.ru/api/v4/contacts";

    const MY_CLIENT_ID = 10382406;

    try {
      const contactsResponse: AxiosResponse<any> = await axios.get(apiUrl, { headers });
      const arrayOfContacts: [] = contactsResponse.data._embedded.contacts;
      const userId = await this.findUserId(arrayOfContacts, dto);

      const contactData = [
        {
          custom_fields_values: [
            {
              field_id: 68965,
              values: [
                {
                  value: dto.phone,
                  enum_id: 34535,
                }
              ]
            },
            {
              field_id: 68967,
              values: [
                {
                  value: dto.email,
                  enum_id: 34543,
                }
              ]
            }
          ],
          id: userId,
          name: dto.name,
          created_by: MY_CLIENT_ID
        }
      ];

      const contactResponse: AxiosResponse<any> = await axios.patch(apiUrl, contactData, { headers });
      return contactResponse.data._embedded.contacts[0];
    } catch (error) {
      console.log(error);
    }
  }

  async checkContact(dto: PersonDto): Promise<UserDataCustomFieldsExist> {
	  console.log(dto);

    const headers = {
      Authorization: `Bearer ${data.access_token}`,
    };
    const apiUrl = "https://alisa3d2007.amocrm.ru/api/v4/contacts";

    try {
      const contactsResponse: AxiosResponse<any> = await axios.get(apiUrl, { headers });
      
      const arrayOfContacts: [] = contactsResponse.data._embedded.contacts;

      const isPhoneExist = await this.checkPersonData(arrayOfContacts, dto.phone, 68965);
      const isEmailExist = await this.checkPersonData(arrayOfContacts, dto.email, 68967);
      
      return {phone: isPhoneExist, email: isEmailExist}
    } catch (error) {
      console.log(error);
    }
  }

  async createContact(dto: PersonDto, param: UserDataCustomFieldsExist): Promise<Contact> {
    const MY_CLIENT_ID = 10382406;

    const headers = {
      Authorization: `Bearer ${data.access_token}`,
    };
    const apiUrl = "https://alisa3d2007.amocrm.ru/api/v4/contacts";

    const contactData = [
      {
        custom_fields_values: [
          {
            field_id: 68965,
            values: [
              {
                value: dto.phone,
                enum_id: 34535,
              }
            ]
          },
          {
            field_id: 68967,
            values: [
              {
                value: dto.email,
                enum_id: 34543,
              }
            ]
          }
        ],
        name: dto.name,
        created_by: MY_CLIENT_ID
      }
    ];

    try {
      if(param.phone === false && param.email === false) {
        const newContactResponse: AxiosResponse<any> = await axios.post(apiUrl, contactData, { headers });
        console.log('create new contact');
        // console.log(newContactResponse.data._embedded.contacts[0]);
        return newContactResponse.data._embedded.contacts[0];
      };
      console.log('update exist contact');
      return this.updateContact(dto);
    } catch (error) {
      console.log(error);
    }
    
  }

  async createDealWithContact(contactId: number): Promise<AxiosResponse<any>> {
    // console.log(`сделка с ${contactId}`);
    const headers = {
      Authorization: `Bearer ${data.access_token}`,
    };

    const apiUrl = "https://alisa3d2007.amocrm.ru/api/v4/leads";

    const dealData = [
      {
        name: 'Новая сделка',
        price: 4200,
        _embedded: {
          contacts: [
            {
              id: contactId, 
            },
          ],
        },
      },
    ];

    try {
      const response = await axios.post(apiUrl, dealData, { headers });
      return response;
    } catch (error) {
      console.error(error);
    }
  }
}
