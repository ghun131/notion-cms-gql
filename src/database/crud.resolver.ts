import { Args, Query, Resolver } from '@nestjs/graphql';

import { DatabaseService } from './database.service';
import { Database } from './entities/database.entity';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthUser } from 'src/auth/decorator/auth-user.decorator';
import { CRUDService } from './crud.service';
import { Page } from 'src/pages/models/pages.model';

@Resolver()
@SkipThrottle()
export class CRUDResolver {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly crudService: CRUDService,
  ) {}

  @Query(() => Database, {
    name: 'getAddProperties',
    description: 'Get properties of one db that can adding',
  })
  async getAddProperties(
    @Args('databaseId', { type: () => String }) databaseId: string,
    @AuthUser() clientName: string,
  ) {
    return this.crudService.getAddProperties(databaseId, clientName);
  }

  @Query(() => Page, {
    name: 'getDetailPageOfDatabase',
    description: 'Get Page Detail of one db',
  })
  async getDetailPageOfDatabase(
    @Args('databaseId', { type: () => String }) databaseId: string,
    @Args('pageId', { type: () => String }) pageId: string,
    @AuthUser() clientName: string,
  ) {
    return this.crudService.getPageDetailOfDatabase(
      databaseId,
      pageId,
      clientName,
    );
  }
}
