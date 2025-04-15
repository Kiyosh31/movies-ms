import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './services/users/users.module';
import { MoviesModule } from './services/movies/movies.module';
import { LoggerModule } from '@app/common';
import { CardsModule } from './services/cards/cards.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
    UsersModule,
    CardsModule,
    MoviesModule,
  ],
  controllers: [],
  providers: [],
})
export class GatewayModule {}
