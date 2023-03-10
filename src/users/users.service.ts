import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PageObjectResponse,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { AdminDatabaseService } from '../admin-database/admin-database.service';
import { ConnectNotionService } from '../connect-notion/connect-notion.service';

@Injectable()
export class UsersService {
  constructor(
    private notionService: ConnectNotionService,
    private adminDatabaseService: AdminDatabaseService,
  ) {}

  async users() {
    const db = await this.adminDatabaseService.getAdminDatabase();
    const users = (await this.notionService.notion.databases.query({
      database_id: db.id,
      sorts: [
        {
          direction: 'descending',
          timestamp: 'created_time',
        },
      ],
    })) as QueryDatabaseResponse;

    return users;
  }

  async getUserById(id: string) {
    const user = (await this.notionService.notion.pages.retrieve({
      page_id: id,
    })) as PageObjectResponse;
    return user;
  }
}
