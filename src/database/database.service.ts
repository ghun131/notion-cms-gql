import { Injectable } from '@nestjs/common';
import { ConnectNotionService } from 'src/connect-notion/connect-notion.service';

interface OneDBParams {
  id: string;
  headers: Record<string, any>;
}

@Injectable()
export class DatabaseService {
  constructor(private notionService: ConnectNotionService) {}

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
