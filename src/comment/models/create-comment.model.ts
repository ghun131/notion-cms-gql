import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class CreateComment {
  @Field(() => String)
  id: string;

  @Field(() => String)
  object: string;
}
