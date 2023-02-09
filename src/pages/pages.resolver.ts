import { Args, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/decorator/auth-user.decorator';
import { Page, Pages } from './models/pages.model';
import { PagesService } from './pages.service';

@Resolver()
export class PagesResolver {
  constructor(private readonly pagesService: PagesService) {}

  @Query(() => Pages)
  async pages(@AuthUser() clientName: string) {
    return this.pagesService.listPages(clientName);
  }

  @Query(() => Page)
  async pageById(@Args('id') id: string, @AuthUser() clientName: string) {
    return this.pagesService.pageById(id, clientName);
  }
}
