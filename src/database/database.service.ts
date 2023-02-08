import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { ConnectNotionService } from 'src/connect-notion/connect-notion.service';
import { CreateDatabaseInput } from './dto/create-database.input';
import { httpHeaders } from 'src/constants';

interface OneDBParams {
  id: string;
  headers: Record<string, any>;
}

@Injectable()
export class DatabaseService {
  constructor(
    private notionService: ConnectNotionService,
    private readonly httpService: HttpService,
  ) {}

  async create(createDatabaseInput: CreateDatabaseInput, clientName: string) {
    const secret = await this.notionService.getSecretByUserName(clientName);
    console.log('createDatabaseInput', createDatabaseInput);

    const { data } = await firstValueFrom(
      this.httpService
        .post('https://api.notion.com/v1/databases/', createDatabaseInput, {
          headers: {
            ...httpHeaders,
            Authorization: `Bearer ${secret}`,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.log('error', error);
            throw 'An error happened!';
          }),
        ),
    );
    return data;
  }

  async dbById(params: OneDBParams) {
    const clientNotion = await this.notionService.getClientNotion(
      params.headers.notionclientname,
    );

    return await clientNotion.databases.query({
      database_id: params.id,
    });
  }

  async getDbContext(params: OneDBParams) {
    const clientNotion = await this.notionService.getClientNotion(
      params.headers.notionclientname,
    );

    return await clientNotion.databases.retrieve({
      database_id: params.id,
    });
  }

  async searchForDbs(headers: Record<string, any>) {
    const clientNotion = await this.notionService.getClientNotion(
      headers.notionclientname,
    );

    return await clientNotion.search({
      filter: {
        value: 'database',
        property: 'object',
      },
      sort: {
        direction: 'ascending',
        timestamp: 'last_edited_time',
      },
    });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} database`;
  // }

  // update(id: number, updateDatabaseInput: UpdateDatabaseInput) {
  //   return `This action updates a #${id} database`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} database`;
  // }
}
