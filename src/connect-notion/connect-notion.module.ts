import { Global, Module } from '@nestjs/common';
import { ConnectNotionService } from './connect-notion.service';

@Global()
@Module({
  providers: [ConnectNotionService],
  exports: [ConnectNotionService],
})
export class ConnectNotionModule {}
