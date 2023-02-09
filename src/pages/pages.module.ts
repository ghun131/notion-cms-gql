import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PagesService } from './pages.service';
import { PagesResolver } from './pages.resolver';
import { ConnectNotionModule } from '../connect-notion/connect-notion.module';

@Module({
  providers: [PagesService, PagesResolver],
  imports: [ConnectNotionModule, HttpModule],
})
export class PagesModule {}
