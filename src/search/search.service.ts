import { Injectable } from '@nestjs/common';
import { SearchParameters } from '@notionhq/client/build/src/api-endpoints';
import { ConnectNotionService } from '../connect-notion/connect-notion.service';

@Injectable()
export class SearchService {
  constructor(private notionService: ConnectNotionService) {}
  async search(searchInput: SearchParameters, headers: Record<string, any>) {
    const clientNotion = await this.notionService.getClientNotion(
      headers.notionclientname,
    );
    return await clientNotion.search(searchInput);
  }
}
