import { GraphQLJSONObject } from 'graphql-type-json';

import { Field, ObjectType } from '@nestjs/graphql';

// TODO: A lot of the field use GraphQLJSONObject, which is not ideal
// We can specify them when it is needed

@ObjectType()
export class NormalText {
  @Field(() => String)
  type: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  text: object;

  @Field(() => GraphQLJSONObject, { nullable: true })
  annotations: object;

  @Field(() => String)
  plain_text: string;

  @Field(() => String, { nullable: true })
  href: string;
}

@ObjectType()
export class Record {
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
export class RecordsResult {
  @Field(() => String)
  object: string;

  @Field(() => [Record])
  results: Record[];

  @Field(() => Boolean, { nullable: true })
  has_more: boolean;
}
