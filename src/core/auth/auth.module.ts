import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import dotenv from 'dotenv';
dotenv.config();
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService,JwtModule],
  
})
export class AuthModule {}
console.log('JWT_SECRETS ===>', process.env.JWT_SECRET);
