import { Injectable } from '@nestjs/common';
import { ConnectNotionService } from '../connect-notion/connect-notion.service';

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
    const blocks = await notionClient.blocks.children.list({ block_id: id });
    return {
      page,
      blocks,
    };
  }
}
