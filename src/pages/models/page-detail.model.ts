import { ObjectType, Field } from '@nestjs/graphql';
import { Blocks } from './blocks.model';
import { Page } from './pages.model';

@ObjectType()
export class PageDetail {
  @Field(() => Page)
  page: Page[];

  @Field(() => Blocks)
  blocks: Blocks;
}
