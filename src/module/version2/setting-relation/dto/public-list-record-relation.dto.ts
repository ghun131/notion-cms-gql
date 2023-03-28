import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class PublicApiInput {
  @Field(() => Boolean)
  publicApiListRecordActiveOfRelation: boolean;

  @Field(() => Boolean)
  publicApiDetailRecordActiveOfRelation: boolean;
}

@InputType()
export class ConfigPublicApiRelationInput {
  @Field(() => PublicApiInput, { description: 'Configuration' })
  configuration: PublicApiInput;

  @Field(() => String, { nullable: false, description: 'Relation Name' })
  relationName: string;

  @Field(() => String, { nullable: false, description: 'Relation Id' })
  relationId: string;
}
