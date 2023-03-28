import { Module } from '@nestjs/common';
import { SettingRelationModule } from '../setting-relation/setting-relation.module';
import { RelationResolver } from './relation.resolver';
import { RelationService } from './relation.service';

@Module({
  imports: [SettingRelationModule],
  providers: [RelationResolver, RelationService],
  exports: [RelationService],
})
export class RelationModule {}
