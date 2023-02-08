import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class CreateUser {
  @Field(() => String)
  id: string;

  @Field(() => String)
  object: string;
}
