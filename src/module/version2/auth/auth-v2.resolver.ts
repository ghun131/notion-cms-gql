import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { AuthV2Service } from './auth-v2.service';
import { SignUpUserV2Input } from './dto/sign-up-user-v2.input';
import { SignInUserV2Input } from './dto/sign-in-user-v2.input';
import { SignUpUserV2Result } from './models/sign-up-user-v2.model';
import { SignInUserV2Result } from './models/sign-in-user-v2.model';
import { VerifyUserV2Input } from './dto/verify-user-v2.input';
import { VerifyUserV2Result } from './models/verify-user-v2.model';

@Resolver()
export class AuthV2Resolver {
  constructor(private readonly authService: AuthV2Service) {}

  @Mutation(() => SignUpUserV2Result)
  signUpV2(@Args('signUpUserInput') signUpUserInput: SignUpUserV2Input) {
    return this.authService.signUp(signUpUserInput);
  }

  @Mutation(() => SignInUserV2Result)
  signInV2(@Args('signInUserInput') signInUserInput: SignInUserV2Input) {
    return this.authService.signIn(signInUserInput);
  }

  @Mutation(() => VerifyUserV2Result)
  verifyUser(@Args('verifyUser') verifyUser: VerifyUserV2Input) {
    return this.authService.verifyUser(verifyUser);
  }
}
