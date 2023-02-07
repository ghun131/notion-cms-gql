import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { ConnectNotionModule } from 'src/connect-notion/connect-notion.module';

@Module({
  providers: [UsersResolver, UsersService],
  imports: [ConnectNotionModule],
})
export class UsersModule {}
