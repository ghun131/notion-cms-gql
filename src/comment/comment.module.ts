import { Module } from '@nestjs/common';
import { ConnectNotionModule } from 'src/connect-notion/connect-notion.module';
import { HttpModule } from '@nestjs/axios';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';

@Module({
  providers: [CommentService, CommentResolver],
  imports: [ConnectNotionModule, HttpModule],
})
export class CommentModule {}
