import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import omit from 'lodash/omit';
import { Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { CreateDatabaseInput } from './dto/create-database.input';
import { UpdateDatabaseInput } from './dto/update-database.input';
import { ConnectNotionService } from '../connect-notion/connect-notion.service';
import { CacheService } from 'src/cache/cache.service';
import {
  PageObjectResponse,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { SettingDatabaseService } from 'src/setting-database/setting-database.service';

interface OneDBParams {
  id: string;
  headers: Record<string, any>;
}

export const httpHeaders = {
  accept: 'application/json',
  'Notion-Version': '2022-06-28',
  'content-type': 'application/json',
};

@Injectable()
export class DatabaseService {
  constructor(
    private notionService: ConnectNotionService,
    private readonly httpService: HttpService,
    private readonly cacheService: CacheService,
    private readonly settingDatabaseService: SettingDatabaseService,
  ) {}

  async create(createDatabaseInput: CreateDatabaseInput, clientName: string) {
    const secret = await this.notionService.getSecretByUserName(clientName);

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
    const key = `database-detail-${params.id}`;
    let database: QueryDatabaseResponse = await this.cacheService.cache.get(
      key,
    );
    if (!database) {
      database = await clientNotion.databases.query({
        database_id: params.id,
      });
      this.cacheService.cache.set(key, database);
    }
    database.results =
      await this.settingDatabaseService.filterPropertiesDisplayed(
        database.results as Array<PageObjectResponse>,
        params.id,
        params.headers.notionclientname,
      );

    return database;
  }

  async getDbContext(params: OneDBParams) {
    const clientNotion = await this.notionService.getClientNotion(
      params.headers.notionclientname,
    );
    const key = `retrieve-database-${params.id}`;
    const databaseCached = await this.cacheService.cache.get(key);
    if (databaseCached) {
      return databaseCached;
    }
    const database = await clientNotion.databases.retrieve({
      database_id: params.id,
    });
    this.cacheService.cache.set(key, database);

    return database;
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

  async update(
    id: string,
    updateDatabaseInput: UpdateDatabaseInput,
    clientName: string,
  ) {
    const secret = await this.notionService.getSecretByUserName(clientName);
    const payload = omit(updateDatabaseInput, ['id']);

    const { data } = await firstValueFrom(
      this.httpService
        .patch('https://api.notion.com/v1/databases/' + id, payload, {
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

  // remove(id: number) {
  //   return `This action removes a #${id} database`;
  // }
}
