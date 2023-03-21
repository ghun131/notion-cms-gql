import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { NotionObjectResponse } from 'src/common/models/notion-object-response.model';

@ObjectType()
export class PropertiesConfigRelation {
  @Field(() => [String])
  property_names: string[];

  @Field(() => GraphQLJSONObject)
  property_details: object;

  @Field(() => NotionObjectResponse)
  configuration: NotionObjectResponse;
}
