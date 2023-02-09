import { Module } from '@nestjs/common';
import { AdminDatabaseModule } from '../admin-database/admin-database.module';
import { ConnectNotionModule } from '../connect-notion/connect-notion.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthResolver, AuthService],
  imports: [AdminDatabaseModule, ConnectNotionModule],
})
export class AuthModule {}
