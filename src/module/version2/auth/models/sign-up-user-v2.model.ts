import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SignUpUserV2Result {
  @Field(() => Boolean)
  success: boolean;
}
