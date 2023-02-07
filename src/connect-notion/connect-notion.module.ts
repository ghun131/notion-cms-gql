import { Module } from '@nestjs/common';
import { ConnectNotionService } from './connect-notion.service';

@Module({
  providers: [ConnectNotionService],
  exports: [ConnectNotionService],
})
export class ConnectNotionModule {}
