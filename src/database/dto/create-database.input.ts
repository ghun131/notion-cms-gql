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
class RichText {
  @Field(() => String)
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

  @Field(() => GraphQLJSON)
  properties: object;
}
