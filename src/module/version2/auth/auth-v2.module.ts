import { Module } from '@nestjs/common';
import { AuthV2Resolver } from './auth-v2.resolver';
import { AuthV2Service } from './auth-v2.service';

@Module({
  providers: [AuthV2Resolver, AuthV2Service],
  imports: [],
})
export class AuthV2Module {}
