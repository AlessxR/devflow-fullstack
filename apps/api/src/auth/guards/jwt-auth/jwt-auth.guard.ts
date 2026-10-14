import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

export type AuthenticatedRequest = Request & {
  user: { sub: number };
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const getHTTP = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const accessToken = getHTTP.cookies?.access_token;

    if (!accessToken) throw new UnauthorizedException();

    try {
      const verifyAccessToken = await this.jwt.verifyAsync<{ sub: number }>(
        accessToken,
      );

      getHTTP.user = verifyAccessToken;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
