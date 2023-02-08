import { Field, InputType } from '@nestjs/graphql';

@InputType()
class Filter {
  @Field(() => String)
  value: string;

  @Field(() => String)
  property: string;
}

@InputType()
class Sort {
  @Field(() => String)
  timestamp: string;

  @Field(() => String)
  direction: string;
}

@InputType()
export class SearchInput {
  @Field(() => String)
  query: string;

  @Field(() => Filter, { nullable: true })
  filter: Filter;

  @Field(() => Sort, { nullable: true })
  sort: Sort;
}
