import { InputType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class UpdateRecordInput {
  @Field(() => String, { description: 'Record Id as Page Id' })
  recordId: string;

  @Field(() => GraphQLJSONObject, { description: 'Properties value input' })
  properties: Record<string, any>;
}
