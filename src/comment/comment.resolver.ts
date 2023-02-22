import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { CreateCommentResponse } from '@notionhq/client/build/src/api-endpoints';
import { AuthUser } from 'src/auth/decorator/auth-user.decorator';
import { handingQueueRequest } from 'src/libs/handing-queue-request';
import { CommentService } from './comment.service';

import { CreateCommentInput } from './dto/create-comment.dto';
import { Comments } from './models/comment.model';
import { CreateComment } from './models/create-comment.model';

const cachedComments: Record<string, any> = {};
const queuesByClientName: Record<string, any> = {};
@Resolver()
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  // @Throttle(20, 10)
  @SkipThrottle()
  @Query(() => Comments)
  async comments(
    @Args('blockId') blockId: string,
    @AuthUser() clientName: string,
  ) {
    const handle = async (handingCurrentRequest: () => any) => {
      return new Promise(async (resolve, reject) => {
        const key = `${blockId}-${clientName}`;
        const listComments = cachedComments[key];
        if (!listComments) {
          console.log('run get data');
          if (!queuesByClientName[clientName]) {
            queuesByClientName[clientName] = {
              requests: [],
              iscleaning: false,
            };
          }
          const requestsInProgress = queuesByClientName[clientName].requests;
          console.log('requestsInProgress', requestsInProgress);
          if (requestsInProgress.length < 3) {
            const requestId = handingCurrentRequest();
            console.log('handingCurrentRequest', requestId);
            requestsInProgress.push({
              requestId,
            });
            const comments = await this.commentService.listComments(
              blockId,
              clientName,
            );
            cachedComments[key] = comments;
            return resolve({ status: 'success', data: comments });
          } else {
            if (!queuesByClientName[clientName].iscleaning) {
              setTimeout(() => {
                queuesByClientName[clientName] = {
                  requests: [],
                  iscleaning: false,
                };
                console.log('is cleared');
                resolve({ status: 'cleanup' });
              }, 2000);
            }
            queuesByClientName[clientName].iscleaning = true;
          }
        } else {
          return resolve({ status: 'success', data: listComments });
        }
      });
    };
    const listComments = handingQueueRequest(handle);

    return listComments;
  }

  @Mutation(() => CreateComment)
  createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
    @AuthUser() clientName: string,
  ): Promise<CreateCommentResponse> {
    return this.commentService.createComment(createCommentInput, clientName);
  }
}
