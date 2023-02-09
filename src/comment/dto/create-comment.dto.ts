import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field(() => String, { description: 'Discussion Thread Id', nullable: true })
  discussionId: string;

  @Field(() => String, { description: 'Page Id' })
  pageId: string;

  @Field(() => String, { description: 'Comment' })
  comment: string;
}
