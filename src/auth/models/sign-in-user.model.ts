import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SignInUserResult {
  @Field(() => String)
  accessToken: string;
}
