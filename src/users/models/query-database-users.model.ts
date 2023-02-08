import { ObjectType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
export class DatabaseUser {
  @Field(() => GraphQLJSONObject, { nullable: true })
  parent: object;

  @Field(() => GraphQLJSONObject, { nullable: true })
  properties: object;

  @Field(() => GraphQLJSONObject, { nullable: true })
  icon: object;

  @Field(() => GraphQLJSONObject, { nullable: true })
  cover: object;

  @Field(() => GraphQLJSONObject, { nullable: true })
  created_by: object;

  @Field(() => GraphQLJSONObject, { nullable: true })
  last_edited_by: object;

  @Field(() => String)
  object: string;

  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  created_time: string;

  @Field(() => String, { nullable: true })
  last_edited_time: string;

  @Field(() => Boolean, { nullable: true })
  archived: boolean;

  @Field(() => String, { nullable: true })
  url: string;
}

@ObjectType()
export class DatabaseUsers {
  @Field(() => GraphQLJSONObject, { nullable: true })
  user: object;

  @Field(() => String)
  object: string;

  @Field(() => String)
  type: string;

  @Field(() => String, { nullable: true })
  next_cursor: string | null;

  @Field(() => Boolean)
  has_more: boolean;

  @Field(() => [DatabaseUser])
  results: DatabaseUser[];
}
