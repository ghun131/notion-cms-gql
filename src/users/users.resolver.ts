import { Query, Resolver } from '@nestjs/graphql';
import { ListUsersResponse } from '@notionhq/client/build/src/api-endpoints';
import { UserResponse } from './users.model';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => UserResponse)
  async users(): Promise<ListUsersResponse> {
    const result = await this.usersService.users();

    return result;
  }
}
