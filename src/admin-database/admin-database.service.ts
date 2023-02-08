import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import { ConnectNotionService } from 'src/connect-notion/connect-notion.service';

@Injectable()
export class AdminDatabaseService {
  private adminDatabase: GetDatabaseResponse;
  constructor(
    private notionService: ConnectNotionService,
    private configService: ConfigService,
  ) {}

  async getAdminDatabase(): Promise<GetDatabaseResponse> {
    if (!this.adminDatabase) {
      this.adminDatabase = await this.notionService.notion.databases.retrieve({
        database_id: this.configService.get('NOTION_DB_ID'),
      });
    }
    return this.adminDatabase;
  }
}
