import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../ormconfig-nest';

import { configLoader } from './configuration/config-loader';
import { validate } from './configuration/config-validator';
import { PostModule } from './modules/post/post.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configLoader],
      validate,
    }),

    TypeOrmModule.forRootAsync(config),

    PostModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {
  // const dataSourceInstance = new DataSource(dataSource);
  // await dataSourceInstance.initialize();
  // await runSeeders(dataSourceInstance);
}
