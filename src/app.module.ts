import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ExecutionContext, Injectable, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GqlExecutionContext, GraphQLModule } from '@nestjs/graphql';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from './config/config';
import { GqlConfigService } from './config/gql-config.service';
import { ConnectNotionModule } from './connect-notion/connect-notion.module';
import { ConnectNotionService } from './connect-notion/connect-notion.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AdminDatabaseModule } from './admin-database/admin-database.module';
import { AuthModule } from './auth/auth.module';
import { SearchModule } from './search/search.module';
import { PagesModule } from './pages/pages.module';
import { CommentModule } from './comment/comment.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { BullModule } from '@nestjs/bull';
import { CacheModule } from './cache/cache.module';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();
    return { req: ctx.req, res: ctx.req.res };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.dev.local',
      load: [config],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GqlConfigService,
    }),
    ConnectNotionModule,
    UsersModule,
    DatabaseModule,
    AdminDatabaseModule,
    AuthModule,
    SearchModule,
    PagesModule,
    CommentModule,
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 3,
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          redis: {
            host: 'localhost',
            port: 6379,
          },
          name: 'pages',
        };
      },
    }),
    CacheModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ConnectNotionService,
    {
      useClass: GqlThrottlerGuard,
      provide: APP_GUARD,
    },
  ],
})
export class AppModule {}
