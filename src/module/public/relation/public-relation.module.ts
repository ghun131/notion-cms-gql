import { Module } from '@nestjs/common';
import { PublicRelationController } from '@/module/public/relation/public-relation.controller';
import { PublicRelationService } from '@/module/public/relation/public-relation.service';
import { SettingRelationModule } from '@/module/version2/setting-relation/setting-relation.module';
import { RelationModule } from '@/module/version2/relation/relation.module';

@Module({
  controllers: [PublicRelationController],
  providers: [PublicRelationService],
  imports: [SettingRelationModule, RelationModule],
})
export class PublicRelationModule {}
