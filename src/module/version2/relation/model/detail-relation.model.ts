import { ObjectType, Field } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class DetailRelationResult {
  @Field(() => String)
  id: string;

  @Field(() => String)
  object: string;

  @Field(() => GraphQLJSON, { nullable: true })
  properties: object;

  @Field(() => String)
  created_time: string;

  @Field(() => GraphQLJSON)
  created_by: object;

  @Field(() => GraphQLJSON, { nullable: true })
  last_edited_by: object;

  @Field(() => String)
  last_edited_time: string;

  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => [GraphQLJSON])
  title: object[];

  @Field(() => [GraphQLJSON])
  description: object[];
}
