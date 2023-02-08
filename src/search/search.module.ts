import { Module } from '@nestjs/common';
import { ConnectNotionModule } from 'src/connect-notion/connect-notion.module';
import { SearchResolver } from './search.resolver';
import { SearchService } from './search.service';

@Module({
  providers: [SearchResolver, SearchService],
  imports: [ConnectNotionModule],
})
export class SearchModule {}
