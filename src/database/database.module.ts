import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DatabaseResolver } from './database.resolver';
import { HttpModule } from '@nestjs/axios';
import { ConnectNotionModule } from '../connect-notion/connect-notion.module';

@Module({
  providers: [DatabaseResolver, DatabaseService],
  imports: [ConnectNotionModule, HttpModule],
})
export class DatabaseModule {}
