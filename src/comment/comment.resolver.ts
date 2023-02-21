import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { CreateCommentResponse } from '@notionhq/client/build/src/api-endpoints';
import { AuthUser } from 'src/auth/decorator/auth-user.decorator';
import { CommentService } from './comment.service';

import { CreateCommentInput } from './dto/create-comment.dto';
import { Comments } from './models/comment.model';
import { CreateComment } from './models/create-comment.model';

const comments: Record<string, any> = {};
let countRequest = 0;
const orderRequest = [];
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
    countRequest += 1;
    const requestId = countRequest;
    console.log('requestId', requestId);
    orderRequest.push({ id: requestId });

    const outComments = await new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        const firstRequest = orderRequest[0];
        // console.log('firstRequest', firstRequest, requestId);
        if (firstRequest?.id === requestId && !firstRequest.inprogress) {
          const key = `${blockId}-${clientName}`;
          const outComments = comments[key];
          if (!outComments) {
            console.log('run get data');
            if (!queuesByClientName[clientName]) {
              queuesByClientName[clientName] = {
                requests: [],
                iscleaning: false,
              };
            }
            const requestsInProgress = queuesByClientName[clientName].requests;
            // console.log('requestsInProgress', requestsInProgress);
            if (requestsInProgress.length < 3) {
              firstRequest.inprogress = true;
              requestsInProgress.push({
                requestId,
              });
              const data = await this.commentService.listComments(
                blockId,
                clientName,
              );
              comments[key] = data;
              clearInterval(interval);
              orderRequest.shift();
              resolve(data);
            } else {
              if (!queuesByClientName[clientName].iscleaning) {
                setTimeout(() => {
                  queuesByClientName[clientName] = {
                    requests: [],
                    iscleaning: false,
                  };
                  console.log('is cleared');
                }, 2000);
              }
              queuesByClientName[clientName].iscleaning = true;
            }
          } else {
            clearInterval(interval);
            orderRequest.shift();
            resolve(outComments);
          }
        }
      }, 500);
    });

    return outComments;
  }

  @Mutation(() => CreateComment)
  createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
    @AuthUser() clientName: string,
  ): Promise<CreateCommentResponse> {
    return this.commentService.createComment(createCommentInput, clientName);
  }
}
