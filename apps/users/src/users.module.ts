import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  DatabaseModule,
  LoggerModule,
  USERS_PACKAGE_NAME,
  USERS_SERVICE_NAME,
} from '@app/common';
import { UserDocument, UserSchema } from './models/user.schema';
import { UsersRepository } from './repository/users.repository';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { JwtModule } from '@nestjs/jwt';
import { NOTIFICATIONS_QUEUE, NOTIFICATIONS_QUEUE_SERVICE } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        MONGODB_URI: Joi.string().required(),
      }),
    }),
    LoggerModule,
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
    ClientsModule.registerAsync([
      {
        name: USERS_SERVICE_NAME,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: USERS_PACKAGE_NAME,
            protoPath: join(__dirname, '../users.proto'),
            url: configService.getOrThrow<string>('GRPC_URI'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: NOTIFICATIONS_QUEUE_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
            queue: NOTIFICATIONS_QUEUE,
          },
        }),
        inject: [ConfigService],
      },
    ]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow<string>('JWT_EXPIRE'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
