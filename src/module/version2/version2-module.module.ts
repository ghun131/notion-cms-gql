import { Module } from '@nestjs/common';
import { AuthV2Module } from './auth/auth-v2.module';
import { RelationModule } from './relation/relation.module';
import { SettingRelationModule } from './setting-relation/setting-relation.module';

@Module({
  providers: [],
  imports: [AuthV2Module, RelationModule, SettingRelationModule],
})
export class Version2Module {}
