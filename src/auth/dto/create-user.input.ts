import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String, { description: 'User Name' })
  userName: string;

  @Field(() => String, { description: 'Integrating Secret' })
  secretKey: string;
}
