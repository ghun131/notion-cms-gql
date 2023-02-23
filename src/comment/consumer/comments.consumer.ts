import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { CommentService } from '../comment.service';

@Processor('comments')
export class CommentsConsumer {
  constructor(private readonly commentService: CommentService) {}
  @Process('get-list-comments')
  async getListCommenta(job: Job<any>) {
    const comments = await this.commentService.listComments(
      job.data.blockId,
      job.data.clientName,
    );

    return comments;
  }
}
