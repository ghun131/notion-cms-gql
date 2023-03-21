import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
class RelationResult {
  @Field(() => String, { nullable: true })
  id: string;

  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  color: string;
}

@ObjectType()
export class ListRelationsResult {
  @Field(() => [RelationResult])
  relations: [RelationResult];
}
