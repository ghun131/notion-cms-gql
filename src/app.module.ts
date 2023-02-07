import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from './config/config';
import { GqlConfigService } from './config/gql-config.service';
import { ConnectNotionModule } from './connect-notion/connect-notion.module';
import { ConnectNotionService } from './connect-notion/connect-notion.service';
import { UsersModule } from './users/users.module';
import { RegisterModule } from './register/register.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'template'),
    }),
    ConnectNotionModule,
    UsersModule,
    RegisterModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConnectNotionService],
})
export class AppModule {}
