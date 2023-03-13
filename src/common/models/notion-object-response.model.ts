import { ObjectType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
export class NotionObjectResponse {
  @Field(() => String, { nullable: true })
  id: string;

  @Field(() => String, { nullable: true })
  object: string;

  @Field(() => String, { nullable: true })
  created_time: string;

  @Field(() => String, { nullable: true })
  last_edited_time: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  created_by: object;

  @Field(() => GraphQLJSONObject, { nullable: true })
  last_edited_by: object;

  @Field(() => GraphQLJSONObject, { nullable: true })
  parent: object;

  @Field(() => Boolean, { nullable: true })
  archived: boolean;

  @Field(() => GraphQLJSONObject, { nullable: true })
  properties: object;
}
