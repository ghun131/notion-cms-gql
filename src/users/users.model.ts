import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
class Person {
  @Field(() => String)
  person: string;
}

@ObjectType()
export class User {
  @Field(() => String)
  id: string;

  @Field(() => String)
  object: string;

  @Field(() => String)
  type: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  avartar_url: string;

  @Field(() => Person)
  person: Person;
}

@ObjectType()
export class UserResponse {
  @Field(() => String)
  user: string;

  @Field(() => String)
  object: string;

  @Field(() => String)
  type: string;

  @Field(() => String, { nullable: true })
  next_cursor: string | null;

  @Field(() => Boolean)
  has_more: boolean;

  @Field(() => [User])
  results: User[];
}
