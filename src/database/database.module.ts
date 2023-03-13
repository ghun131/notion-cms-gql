import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DatabaseResolver } from './database.resolver';
import { HttpModule } from '@nestjs/axios';
import { ConnectNotionModule } from '../connect-notion/connect-notion.module';
import { SettingDatabaseModule } from 'src/setting-database/setting-database.module';
import { CRUDService } from './crud.service';
import { CRUDResolver } from './crud.resolver';
import { PagesModule } from 'src/pages/pages.module';

@Module({
  providers: [DatabaseResolver, DatabaseService, CRUDService, CRUDResolver],
  imports: [
    ConnectNotionModule,
    HttpModule,
    SettingDatabaseModule,
    PagesModule,
  ],
  exports: [DatabaseService],
})
export class DatabaseModule {}
