import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@notionhq/client';
import { EnvironmentVariables } from 'src/types';

@Injectable()
export class ConnectNotionService {
  notion: Client;
  constructor(private configService: ConfigService<EnvironmentVariables>) {
    this.notion = new Client({
      auth: this.configService.get('NOTION_SECRET'),
    });
  }
}
