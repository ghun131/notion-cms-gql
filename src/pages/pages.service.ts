import { Injectable } from '@nestjs/common';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { ConnectNotionService } from 'src/connect-notion/connect-notion.service';

@Injectable()
export class PagesService {
  constructor(private notionService: ConnectNotionService) {}

  async listPages(clientName: string) {
    const notionClient = await this.notionService.getClientNotion(clientName);
    return notionClient.search({
      filter: { value: 'page', property: 'object' },
    });
  }

  async pageById(id: string, clientName: string) {
    const notionClient = await this.notionService.getClientNotion(clientName);
    const page = await notionClient.pages.retrieve({
      page_id: id,
    });
    return page as PageObjectResponse;
  }
}
