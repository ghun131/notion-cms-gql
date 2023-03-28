import { InputType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class ConfigPropertiesRelationInput {
  @Field(() => GraphQLJSONObject, { description: 'Configuration' })
  configuration: Record<string, any>;

  @Field(() => String, { nullable: false, description: 'Relation Name' })
  relationName: string;

  @Field(() => String, { nullable: false, description: 'Relation Id' })
  relationId: string;
}
