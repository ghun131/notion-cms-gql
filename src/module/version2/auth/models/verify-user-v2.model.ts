import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class VerifyUserV2Result {
  @Field(() => String)
  id: string;

  @Field(() => String)
  object: string;
}
