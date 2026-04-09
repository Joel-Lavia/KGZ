import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import dotenv from 'dotenv';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UsersChema } from 'src/modules/users/schemas/user.schema';
import { passwordService } from '../services/password/password.service';
import { userJwtStrategy } from '../strategy/Auth.JwtStrategy';
dotenv.config();
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UsersChema }]),
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, passwordService, userJwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
