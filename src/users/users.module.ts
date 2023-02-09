import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { ConnectNotionModule } from '../connect-notion/connect-notion.module';
import { AdminDatabaseModule } from '../admin-database/admin-database.module';

@Module({
  providers: [UsersResolver, UsersService],
  imports: [ConnectNotionModule, AdminDatabaseModule],
})
export class UsersModule {}
