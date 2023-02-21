import { BadRequestException, Injectable } from '@nestjs/common';
import { ConnectNotionService } from 'src/connect-notion/connect-notion.service';
import { CreateCommentInput } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(private notionService: ConnectNotionService) {}

  async listComments(blockId: string, clientName: string) {
    try {
      const notionClient = await this.notionService.getClientNotion(clientName);
      return await notionClient.comments
        .list({
          block_id: blockId,
        })
        .catch((err) => {
          console.log('error', err);
          return {};
        });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async createComment(
    createCommentInput: CreateCommentInput,
    clientName: string,
  ) {
    const notionClient = await this.notionService.getClientNotion(clientName);
    if (createCommentInput.discussionId) {
      return notionClient.comments.create({
        discussion_id: createCommentInput.discussionId,
        rich_text: [
          {
            text: {
              content: createCommentInput.comment,
            },
          },
        ],
      });
    } else if (createCommentInput.pageId) {
      return notionClient.comments.create({
        parent: {
          page_id: createCommentInput.pageId,
          type: 'page_id',
        },
        rich_text: [
          {
            text: {
              content: createCommentInput.comment,
            },
          },
        ],
      });
    }
  }
}
