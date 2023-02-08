import { Module } from '@nestjs/common';
import { AdminDatabaseService } from './admin-database.service';
import { ConnectNotionModule } from 'src/connect-notion/connect-notion.module';

@Module({
  providers: [AdminDatabaseService],
  imports: [ConnectNotionModule],
  exports: [AdminDatabaseService],
})
export class AdminDatabaseModule {}
