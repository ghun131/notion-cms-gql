import { ObjectType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { NormalText } from 'src/database/entities/text.entity';

@ObjectType()
export class Comment {
  @Field(() => String)
  id: string;

  @Field(() => String)
  object: string;

  @Field(() => String)
  created_time: string;

  @Field(() => String)
  last_edited_time: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  created_by: object;

  @Field(() => GraphQLJSONObject, { nullable: true })
  last_edited_by: object;

  @Field(() => GraphQLJSONObject, { nullable: true })
  parent: object;

  @Field(() => String)
  discussion_id: string;

  @Field(() => [NormalText])
  rich_text: Array<NormalText>;
}
@ObjectType()
export class Comments {
  @Field(() => [Comment])
  results: Comment[];

  @Field(() => String)
  object: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  next_cursor: any;

  @Field(() => Boolean)
  has_more: boolean;

  @Field(() => String)
  type: string;
}
