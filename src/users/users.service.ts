import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConnectNotionService } from 'src/connect-notion/connect-notion.service';
import { EnvironmentVariables } from 'src/types';

@Injectable()
export class UsersService {
  constructor(
    private configService: ConfigService<EnvironmentVariables>,
    private notionService: ConnectNotionService,
  ) {}

  async users() {
    // const query = await this.notionService.notion.databases.query({
    //   database_id: this.configService.get('NOTION_DB_ID'),
    // });

    const users = await this.notionService.notion.users.list({});
    return users;
  }
}
