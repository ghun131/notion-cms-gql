import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SignUpUserResult {
  @Field(() => String)
  id: string;

  @Field(() => String)
  object: string;

  @Field(() => String)
  accessToken: string;
}
