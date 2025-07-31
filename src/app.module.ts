import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TypeOrmPostRepository } from '@infrastructure/persistence/typeorm-post.repository';
import { RedisCacheAdapter } from '@infrastructure/adapters/redis-cache.adapter';
import { PostController } from '@presentation/controllers/post.controller';
import { PostgresModule } from '@infrastructure/shared/postgres.module';
import { RedisModule } from '@infrastructure/shared/redis.module';
import { PostEntity } from '@presentation/entities/post.entity';
import { CacheRepository } from '@core/ports/cache.repository';
import { PostUseCases } from '@core/use-cases/post.use-cases';
import { PostRepository } from '@core/ports/post.repository';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PostgresModule.forRoot(),
    RedisModule.forRoot(),
    PostgresModule.forFeature([PostEntity]),
  ],
  controllers: [PostController],
  providers: [
    {
      provide: 'PostRepository',
      useClass: TypeOrmPostRepository,
    },
    {
      provide: 'CacheRepository',
      useClass: RedisCacheAdapter,
    },
    {
      provide: PostUseCases,
      useFactory: (postRepo: PostRepository, cacheRepo: CacheRepository) =>
        new PostUseCases(postRepo, cacheRepo),
      inject: ['PostRepository', 'CacheRepository'],
    },
  ],
})
export class AppModule {}
