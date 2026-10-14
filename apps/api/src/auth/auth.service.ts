import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';
import { LoginDto } from '../users/dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly users: UsersService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.users.login(dto);
    const accessToken = await this.jwt.signAsync({ sub: user.id });

    return {
      accessToken,
    };
  }
}
