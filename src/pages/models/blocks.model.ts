import { ObjectType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
export class Block {
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

  @Field(() => String)
  type: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  paragraph: object;

  @Field(() => GraphQLJSONObject, { nullable: true })
  parent: object;

  @Field(() => Boolean)
  archived: boolean;

  @Field(() => Boolean)
  has_children: boolean;
}
@ObjectType()
export class Blocks {
  @Field(() => [Block])
  results: Block[];

  @Field(() => String)
  object: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  next_cursor: any;

  @Field(() => Boolean)
  has_more: boolean;

  @Field(() => String)
  type: string;
}
