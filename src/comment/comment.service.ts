import { BadRequestException, Injectable } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';
import { ConnectNotionService } from 'src/connect-notion/connect-notion.service';
import { CreateCommentInput } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    private notionService: ConnectNotionService,
    private readonly cacheService: CacheService,
  ) {}

  async listComments(blockId: string, clientName: string) {
    try {
      const key = `comments-${blockId}-${clientName}`;
      const cachedComments = await this.cacheService.cache.get(key);
      if (cachedComments) {
        return cachedComments;
      }
      const notionClient = await this.notionService.getClientNotion(clientName);
      const comments = await notionClient.comments
        .list({
          block_id: blockId,
        })
        .catch((err) => {
          console.log('error', err);
          return {};
        });
      await this.cacheService.cache.set(key, comments);
      return comments;
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
