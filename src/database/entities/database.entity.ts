import { GraphQLJSONObject } from 'graphql-type-json';

import { Field, ObjectType } from '@nestjs/graphql';
import { NormalText } from './text.entity';

// TODO: A lot of the field use GraphQLJSONObject, which is not ideal
// We can specify them when it is needed

@ObjectType()
export class Database {
  @Field(() => String, { description: 'db id with hyphen' })
  id: string;

  @Field(() => String)
  object: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  cover: object;

  @Field(() => GraphQLJSONObject, { nullable: true })
  icon: object;

  @Field(() => String)
  created_time: string;

  @Field(() => GraphQLJSONObject)
  created_by: object;

  @Field(() => GraphQLJSONObject, { nullable: true })
  last_edited_by: object;

  @Field(() => String)
  last_edited_time: string;

  @Field(() => [NormalText])
  title: NormalText[];

  @Field(() => [NormalText])
  description: NormalText[];

  @Field(() => Boolean)
  is_inline: boolean;

  @Field(() => GraphQLJSONObject)
  properties: object;

  @Field(() => GraphQLJSONObject)
  parent: object;

  @Field(() => String)
  url: string;

  @Field(() => Boolean)
  archived: boolean;
}

@ObjectType()
export class DatabaseResponse {
  @Field(() => String)
  object: string;

  @Field(() => [Database])
  results: Database[];
}
