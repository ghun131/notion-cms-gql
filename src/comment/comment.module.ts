import { Module } from '@nestjs/common';
import { ConnectNotionModule } from 'src/connect-notion/connect-notion.module';
import { HttpModule } from '@nestjs/axios';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { CommentsConsumer } from './consumer/comments.consumer';
import { BullModule } from '@nestjs/bull';

@Module({
  providers: [CommentService, CommentResolver, CommentsConsumer],
  imports: [
    ConnectNotionModule,
    HttpModule,
    BullModule.registerQueue({
      name: 'comments',
    }),
  ],
})
export class CommentModule {}
