import { Controller, Get, Param } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { PublicRelationService } from './public-relation.service';

@SkipThrottle()
@Controller('public')
export class PublicRelationController {
  constructor(private readonly publicRelationService: PublicRelationService) {}

  @Get('/:configId/:relationId')
  getListRecordOfRelation(
    @Param('configId') configId: string,
    @Param('relationId') relationId: string,
  ) {
    return this.publicRelationService.getListActiveRecordOfRelation(
      configId,
      relationId,
    );
  }

  @Get('/:configId/:relationId/:recordId')
  getDetailRecordOfRelation(
    @Param('configId') configId: string,
    @Param('relationId') relationId: string,
    @Param('recordId') recordId: string,
  ) {
    return this.publicRelationService.getDetailActiveRecordOfRelation(
      configId,
      relationId,
      recordId,
    );
  }
}
