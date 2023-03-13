import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { CreatePageResponse } from '@notionhq/client/build/src/api-endpoints';
import { AuthService } from './auth.service';
import { SignUpUserInput } from './dto/sign-up-user.input';
import { SignInUserInput } from './dto/sign-in-user.input';
import { SignUpUserResult } from './models/sign-up-user.model';
import { SignInUserResult } from './models/sign-in-user.model';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignUpUserResult)
  signUp(
    @Args('signUpUserInput') signUpUserInput: SignUpUserInput,
  ): Promise<CreatePageResponse> {
    return this.authService.createUser(signUpUserInput);
  }

  @Mutation(() => SignInUserResult)
  signIn(@Args('signInUserInput') signInUserInput: SignInUserInput) {
    return this.authService.signIn(signInUserInput.userName);
  }
}
