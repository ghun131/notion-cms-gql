import { Module } from '@nestjs/common';
import { SettingDatabaseResolver } from './setting-database.resolver';
import { SettingDatabaseService } from './setting-database.service';

@Module({
  providers: [SettingDatabaseService, SettingDatabaseResolver],
  exports: [SettingDatabaseService],
})
export class SettingDatabaseModule {}
