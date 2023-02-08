import { RichText } from './create-database.input';
import { InputType, Field } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class UpdateDatabaseInput {
  @Field(() => String)
  id: string;

  @Field(() => [RichText])
  title: RichText[];

  @Field(() => GraphQLJSON)
  properties: object;

  @Field(() => [RichText], { nullable: true })
  description: RichText[];
}
