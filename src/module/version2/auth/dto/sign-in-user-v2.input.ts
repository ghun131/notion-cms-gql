import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SignInUserV2Input {
  @Field(() => String, { description: 'Email' })
  email: string;

  @Field(() => String, { description: 'Password' })
  password: string;
}
