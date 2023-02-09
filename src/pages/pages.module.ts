import { Module } from '@nestjs/common';
import { ConnectNotionModule } from 'src/connect-notion/connect-notion.module';
import { HttpModule } from '@nestjs/axios';
import { PagesService } from './pages.service';
import { PagesResolver } from './pages.resolver';

@Module({
  providers: [PagesService, PagesResolver],
  imports: [ConnectNotionModule, HttpModule],
})
export class PagesModule {}
