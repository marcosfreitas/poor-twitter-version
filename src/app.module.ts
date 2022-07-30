import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'ormconfig';
import { DataSource } from 'typeorm';

import { configLoader } from './configuration/config-loader';
import { validate } from './configuration/config-validator';
import { PostsModule } from './modules/posts/posts.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configLoader],
      validate,
    }),

    TypeOrmModule.forRootAsync(config),

    PostsModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
