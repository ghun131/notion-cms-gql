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
  GetDatabaseResponse,
  PageObjectResponse,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { SettingDatabaseService } from 'src/setting-database/setting-database.service';
import { PagesService } from 'src/pages/pages.service';

export const httpHeaders = {
  accept: 'application/json',
  'Notion-Version': '2022-06-28',
  'content-type': 'application/json',
};

@Injectable()
export class CRUDService {
  constructor(
    private notionService: ConnectNotionService,
    private readonly httpService: HttpService,
    private readonly cacheService: CacheService,
    private readonly settingDatabaseService: SettingDatabaseService,
    private readonly pageService: PagesService,
  ) {}

  async getAddProperties(databaseId: string, clientName: string) {
    const clientNotion = await this.notionService.getClientNotion(clientName);
    const key = `retrieve-database-${databaseId}`;
    let retrieveDb: GetDatabaseResponse = await this.cacheService.cache.get(
      key,
    );
    if (!retrieveDb) {
      retrieveDb = await clientNotion.databases.retrieve({
        database_id: databaseId,
      });
      this.cacheService.cache.set(key, retrieveDb);
    }

    retrieveDb.properties =
      await this.settingDatabaseService.filterAddPropertiesObject(
        retrieveDb.properties,
        databaseId,
        clientName,
      );
    return retrieveDb;
  }

  async getPageDetailOfDatabase(databaseId, pageId, clientName) {
    const page = await this.pageService.pageById(pageId, clientName);
    page.properties =
      await this.settingDatabaseService.filterEditPropertiesObject(
        page.properties,
        databaseId,
        clientName,
      );

    return page;
  }
}
