import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateCommentResponse } from '@notionhq/client/build/src/api-endpoints';
import { AuthUser } from 'src/auth/decorator/auth-user.decorator';
import { CommentService } from './comment.service';
import { CreateCommentInput } from './dto/create-comment.dto';
import { Comments } from './models/comment.model';
import { CreateComment } from './models/create-comment.model';

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

  @Mutation(() => CreateComment)
  createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
    @AuthUser() clientName: string,
  ): Promise<CreateCommentResponse> {
    return this.commentService.createComment(createCommentInput, clientName);
  }
}
