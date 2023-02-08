import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { AdminDatabaseModule } from 'src/admin-database/admin-database.module';
import { ConnectNotionModule } from 'src/connect-notion/connect-notion.module';

@Module({
  providers: [AuthResolver, AuthService],
  imports: [AdminDatabaseModule, ConnectNotionModule],
})
export class AuthModule {}
