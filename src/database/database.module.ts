import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DatabaseResolver } from './database.resolver';
import { ConnectNotionModule } from 'src/connect-notion/connect-notion.module';

@Module({
  providers: [DatabaseResolver, DatabaseService],
  imports: [ConnectNotionModule],
})
export class DatabaseModule {}
