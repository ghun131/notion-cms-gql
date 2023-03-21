import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SignInUserV2Result {
  @Field(() => String)
  id: string;

  @Field(() => String)
  accessToken: string;
}
