import { Args, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/decorator/auth-user.decorator';
import { CommentService } from './comment.service';
import { Comments } from './models/comment.model';

@Resolver()
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Query(() => Comments)
  async comments(
    @Args('blockId') blockId: string,
    @AuthUser() clientName: string,
  ) {
    return this.commentService.listComments(blockId, clientName);
  }
}
