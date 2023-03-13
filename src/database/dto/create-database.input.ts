import { InputType, Field } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@InputType()
class Text {
  @Field(() => String)
  content: string;

  @Field(() => String, { nullable: true })
  link?: string;
}

@InputType()
export class RichText {
  @Field(() => String, { nullable: true })
  type: string;

  @Field(() => Text)
  text: Text;
}

@InputType()
class Parent {
  @Field(() => String)
  type: string;

  @Field(() => String)
  page_id: string;
}

@InputType()
export class CreateDatabaseInput {
  @Field(() => Parent)
  parent: Parent;

  @Field(() => [RichText])
  title: RichText[];

  @Field(() => [RichText], { nullable: true })
  description?: RichText[];

  @Field(() => GraphQLJSON)
  properties: object;
}
