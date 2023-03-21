import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ConfigPropertiesRelationInput {
  @Field(() => String, { description: 'Configuration' })
  configuration: string;

  @Field(() => String, { nullable: false, description: 'Relation Name' })
  relationName: string;

  @Field(() => String, { nullable: false, description: 'Relation Id' })
  relationId: string;
}
