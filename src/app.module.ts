import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'ormconfig-nest';

import { configLoader } from './configuration/config-loader';
import { validate } from './configuration/config-validator';
import { PostsModule } from './modules/post/post.module';
import { UsersModule } from './modules/user/user.module';

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
export class AppModule {
  // @todo to be implemented
  /*
  async onModuleInit(): Promise<void> {
    const dataSourceInstance = new DataSource(dataSource);
    await dataSourceInstance.initialize();
    await runSeeders(dataSourceInstance);
  }*/
}
