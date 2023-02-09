import { GraphQLJSONObject } from 'graphql-type-json';

import { Field, ObjectType } from '@nestjs/graphql';
import { NormalText } from '../database/entities/text.entity';

// TODO: SearchResult class is very similar to Database class. They should be reused

@ObjectType()
export class SearchResult {
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

  @Field(() => [NormalText], { nullable: true })
  title: NormalText[];

  @Field(() => [NormalText], { nullable: true })
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
export class SearchResponse {
  @Field(() => String)
  object: string;

  @Field(() => [SearchResult])
  results: SearchResult[];
}
