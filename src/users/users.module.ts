import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { ConnectNotionModule } from 'src/connect-notion/connect-notion.module';
import { AdminDatabaseModule } from 'src/admin-database/admin-database.module';

@Module({
  providers: [UsersResolver, UsersService],
  imports: [ConnectNotionModule, AdminDatabaseModule],
})
export class UsersModule {}
