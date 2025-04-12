import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/common';
import { UserDocument, UserSchema } from './models/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
