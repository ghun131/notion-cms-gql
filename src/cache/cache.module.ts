import { Module, CacheModule as NestCacheModule, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';
import { CacheService } from './cache.service';

@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync({
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (configService: ConfigService): any => {
        return {
          isGlobal: true,
          store: async () =>
            await redisStore({
              socket: {
                host: configService.get('redis.host'),
                port: configService.get('redis.port'),
              },
              ttl: 300, // 5 minutes
            }),
        };
      },
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
