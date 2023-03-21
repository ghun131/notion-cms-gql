import { ObjectType, Field } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class CreateRecordResult {
  @Field(() => String)
  id: string;

  @Field(() => GraphQLJSON, { nullable: true })
  properties: object;
}
