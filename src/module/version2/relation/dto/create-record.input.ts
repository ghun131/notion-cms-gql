import { InputType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class CreateRecordInput {
  @Field(() => String, { description: 'Relation Id as Database Id' })
  relationId: string;

  @Field(() => GraphQLJSONObject, { description: 'Properties value input' })
  properties: Record<string, any>;
}
