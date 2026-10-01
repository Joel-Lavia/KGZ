import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UsersChema } from './schemas/user.schema';
import { passwordService } from 'src/core/services/password/password.service';
import { AuthModule } from 'src/core/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UsersChema }]),
    AuthModule
  ],
  controllers: [UsersController],
  providers: [UsersService, passwordService],
})
export class UsersModule {}
