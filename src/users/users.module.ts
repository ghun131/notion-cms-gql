import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { ConnectNotionService } from 'src/connect-notion/connect-notion.service';

@Module({
  providers: [UsersResolver, UsersService, ConnectNotionService]
})
export class UsersModule {}
