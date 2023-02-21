import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@notionhq/client';
import get from 'lodash/get';
import { EnvironmentVariables } from '../types';

const secrets: Map<string, string> = new Map([]);

@Injectable()
export class ConnectNotionService {
  notion: Client;
  constructor(private configService: ConfigService<EnvironmentVariables>) {
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
    let secret = secrets.get(clientName);
    if (!secret) {
      secret = await this.getSecretByUserName(clientName);
      secrets.set(clientName, secret);
    }
    // console.log('secret', secret);

    return new Client({ auth: secret });
  }
}
