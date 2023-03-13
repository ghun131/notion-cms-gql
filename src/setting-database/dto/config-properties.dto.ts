import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ConfigPropertiesInput {
  @Field(() => String, { description: 'Configuration' })
  configuration: string;

  @Field(() => String, { nullable: false, description: 'Database Id' })
  databaseId: string;
}
