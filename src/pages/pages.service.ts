import { Injectable } from '@nestjs/common';
import {
  GetPageResponse,
  PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { CacheService } from 'src/cache/cache.service';
import { ConnectNotionService } from '../connect-notion/connect-notion.service';

@Injectable()
export class PagesService {
  constructor(
    private notionService: ConnectNotionService,
    private readonly cacheService: CacheService,
  ) {}

  async listPages(clientName: string) {
    const key = `pages-${clientName}`;
    const cachedPages = await this.cacheService.cache.get(key);
    if (cachedPages) {
      return cachedPages;
    }
    const notionClient = await this.notionService.getClientNotion(clientName);
    const pages = await notionClient.search({
      filter: { value: 'page', property: 'object' },
    });
    await this.cacheService.cache.set(key, pages);
    return pages;
  }

  async pageById(id: string, clientName: string) {
    const key = `page-detail-${id}`;
    const pageCached: PageObjectResponse = await this.cacheService.cache.get(
      key,
    );
    if (pageCached) {
      return pageCached;
    }
    const notionClient = await this.notionService.getClientNotion(clientName);
    const page = await notionClient.pages.retrieve({
      page_id: id,
    });
    return page as PageObjectResponse;
  }

  async pageByIdAndBlocks(id: string, clientName: string) {
    const key = `page-detail-${id}`;
    let page = await this.cacheService.cache.get(key);
    if (!page) {
      const notionClient = await this.notionService.getClientNotion(clientName);
      page = await notionClient.pages.retrieve({
        page_id: id,
      });
    }
    const blocks = await this.getBlocks(clientName, id);

    return {
      page,
      blocks,
    };
  }

  async getBlocks(clientName: string, blockId: string) {
    const key = `list-blocks-${blockId}`;
    const blocksCached = await this.cacheService.cache.get(key);
    if (blocksCached) {
      return blocksCached;
    }
    const notionClient = await this.notionService.getClientNotion(clientName);
    const blocks = await notionClient.blocks.children.list({
      block_id: blockId,
    });
    return blocks;
  }
}
