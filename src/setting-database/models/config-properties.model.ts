import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ConfigProperties {
  @Field(() => String, { nullable: true })
  id: string;

  @Field(() => String, { nullable: true })
  object: string;
}
