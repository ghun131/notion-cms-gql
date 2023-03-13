import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SignUpUserInput {
  @Field(() => String, { description: 'User Name' })
  userName: string;

  @Field(() => String, { description: 'Integrating Secret' })
  secretKey: string;
}
