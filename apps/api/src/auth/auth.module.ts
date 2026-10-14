import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => {
        const secretKey = process.env.JWT_SECRET;

        if (!secretKey) throw new Error('JWT_SECRET is not configured');

        return {
          secret: secretKey,
          signOptions: {
            expiresIn: '15m',
          },
        };
      },
    }),
    UsersModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
