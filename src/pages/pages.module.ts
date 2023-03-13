import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PagesService } from './pages.service';
import { PagesResolver } from './pages.resolver';
import { ConnectNotionModule } from '../connect-notion/connect-notion.module';
import { BullModule } from '@nestjs/bull';
import { PagesConsumer } from './consumer/pages.consumer';

@Module({
  providers: [PagesService, PagesResolver, PagesConsumer],
  imports: [
    ConnectNotionModule,
    HttpModule,
    BullModule.registerQueue({
      name: 'pages',
    }),
  ],
  exports: [PagesService],
})
export class PagesModule {}
