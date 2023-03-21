import { Module } from '@nestjs/common';
import { SettingRelationResolver } from './setting-relation.resolver';
import { SettingRelationService } from './setting-relation.service';

@Module({
  providers: [SettingRelationService, SettingRelationResolver],
  exports: [SettingRelationService],
})
export class SettingRelationModule {}
