import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import {
  DatabaseUsers,
  DatabaseUser,
} from './models/query-database-users.model';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => DatabaseUsers)
  async users(@Context() context): Promise<any> {
    console.log('context', context.req.headers);
    const result = await this.usersService.users();

    return result;
  }

  @Query(() => DatabaseUser)
  async getUserById(
    @Args('id', { type: () => String }) id: string,
  ): Promise<PageObjectResponse> {
    const result = await this.usersService.getUserById(id);

    return result;
  }
}
