import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class VerifyUserV2Input {
  @Field(() => String, { description: 'Email' })
  email: string;

  @Field(() => String, { description: 'Code' })
  code: string;
}
