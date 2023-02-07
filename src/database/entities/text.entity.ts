import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

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
