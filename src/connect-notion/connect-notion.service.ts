import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@notionhq/client';
import get from 'lodash/get';
import { CacheService } from 'src/cache/cache.service';
import { EnvironmentVariables } from '../types';

@Injectable()
export class ConnectNotionService {
  notion: Client;
  constructor(
    private configService: ConfigService<EnvironmentVariables>,
    private cacheService: CacheService,
  ) {
    this.notion = new Client({
      auth: this.configService.get('NOTION_SECRET'),
    });
  }

  async getSecretByUserName(userName: string) {
    const query = await this.notion.databases.query({
      database_id: this.configService.get('NOTION_DB_ID'),
      filter: {
        property: 'Name',
        title: { equals: userName },
      },
    });

    const secret = get(
      query,
      'results[0].properties.secret.rich_text[0].plain_text',
      '',
    );

    return secret;
  }

  async getClientNotion(clientName: string) {
    let secret = await this.cacheService.cache.get<string>(clientName);
    if (!secret) {
      secret = await this.getSecretByUserName(clientName);
      this.cacheService.cache.set(clientName, secret);
    }
    // console.log('secret', secret);

    return new Client({ auth: secret });
  }
}
