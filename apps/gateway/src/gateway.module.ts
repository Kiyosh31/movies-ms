import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './microservices/users/users.module';
import { MoviesModule } from './microservices/movies/movies.module';
import { LoggerModule } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
    UsersModule,
    MoviesModule,
  ],
  controllers: [],
  providers: [],
})
export class GatewayModule {}
