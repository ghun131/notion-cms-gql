import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { CreatePageResponse } from '@notionhq/client/build/src/api-endpoints';
import { AuthService } from './auth.service';
import { CreateUserInput } from './dto/create-user.input';
import { CreateUser } from './models/create-user.model';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => CreateUser)
  createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<CreatePageResponse> {
    return this.authService.createUser(createUserInput);
  }
}
