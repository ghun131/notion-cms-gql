import { Module } from '@nestjs/common';
import { ConnectNotionModule } from '../connect-notion/connect-notion.module';
import { AdminDatabaseService } from './admin-database.service';

@Module({
  providers: [AdminDatabaseService],
  imports: [ConnectNotionModule],
  exports: [AdminDatabaseService],
})
export class AdminDatabaseModule {}
