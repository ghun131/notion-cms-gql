import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import {
  ListUsersResponse,
  UserObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { Users, User } from './users.model';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => Users)
  async users(@Context() context): Promise<ListUsersResponse> {
    console.log('context', context.req.headers);
    const result = await this.usersService.users();

    return result;
  }

  @Query(() => User)
  async getUserById(
    @Args('id', { type: () => String }) id: string,
  ): Promise<UserObjectResponse> {
    const result = await this.usersService.getUserById(id);

    return result;
  }
}
