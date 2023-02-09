import { Injectable } from '@nestjs/common';
import { ConnectNotionService } from 'src/connect-notion/connect-notion.service';

@Injectable()
export class CommentService {
  constructor(private notionService: ConnectNotionService) {}

  async listComments(blockId: string, clientName: string) {
    const notionClient = await this.notionService.getClientNotion(clientName);
    return notionClient.comments.list({
      block_id: blockId,
    });
  }
}
