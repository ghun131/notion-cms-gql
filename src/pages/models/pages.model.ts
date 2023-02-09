import { ObjectType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
export class Page {
  @Field(() => String)
  id: string;

  @Field(() => String)
  object: string;

  @Field(() => String)
  url: string;

  @Field(() => String)
  created_time: string;

  @Field(() => String)
  last_edited_time: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  created_by: object;

  @Field(() => GraphQLJSONObject, { nullable: true })
  last_edited_by: object;

  @Field(() => GraphQLJSONObject, { nullable: true })
  cover: object;

  @Field(() => GraphQLJSONObject, { nullable: true })
  icon: object;

  @Field(() => GraphQLJSONObject, { nullable: true })
  parent: object;

  @Field(() => GraphQLJSONObject, { nullable: true })
  properties: object;

  @Field(() => Boolean)
  archived: boolean;
}
@ObjectType()
export class Pages {
  @Field(() => [Page])
  results: Page[];

  @Field(() => String)
  object: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  next_cursor: any;

  @Field(() => Boolean)
  has_more: boolean;

  @Field(() => String)
  type: string;
}
