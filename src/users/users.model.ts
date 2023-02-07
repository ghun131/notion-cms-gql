import { ObjectType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
export class User {
  @Field(() => String)
  id: string;

  @Field(() => String)
  object: string;

  @Field(() => String)
  type: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  avartar_url: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  person: object;

  @Field(() => GraphQLJSONObject, { nullable: true })
  bot: object;
}

@ObjectType()
export class Users {
  @Field(() => GraphQLJSONObject)
  user: object;

  @Field(() => String)
  object: string;

  @Field(() => String)
  type: string;

  @Field(() => String, { nullable: true })
  next_cursor: string | null;

  @Field(() => Boolean)
  has_more: boolean;

  @Field(() => [User])
  results: User[];
}
