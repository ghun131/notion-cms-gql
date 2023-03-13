import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SignInUserInput {
  @Field(() => String, { description: 'User Name' })
  userName: string;
}
