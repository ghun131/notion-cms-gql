import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RelationPropertyInput {
  @Field(() => String, { description: 'Property Name' })
  name: string;

  @Field(() => String, { description: 'Property Type', nullable: true })
  type: string;
}

@InputType()
export class CreateRelationInput {
  // should be move to accessToken to get Page Id as User Id login
  @Field(() => String, { description: 'Page Id as User Id' })
  pageId: string;

  @Field(() => String, { description: 'Relation Name' })
  name: string;

  @Field(() => [RelationPropertyInput], { description: 'Relation Properties' })
  properties: [RelationPropertyInput];
}
