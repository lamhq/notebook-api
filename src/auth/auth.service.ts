import { Injectable } from '@nestjs/common';
import ms from 'ms';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TOKEN_COOKIE_NAME } from 'common/constants/auth';
import { Request } from 'express';
import { classToPlain } from 'class-transformer';
import { JwtPayload } from './types/jwt-payload';
import { Identity } from './types/identity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private configService: ConfigService) {}

  createIdentity(payload: JwtPayload): Identity {
    const expireAt = new Date();
    const duration = this.configService.get<string>('auth.accessTokenLifetime');
    // authentication config was validated before so i can use duration!
    // instead of checking its existence again
    expireAt.setSeconds(expireAt.getSeconds() + ms(duration!) / 1000);
    const token = new Identity({
      displayName: payload.displayName,
      email: payload.email,
      avatar: payload.avatar,
      roles: payload.roles,
      token: this.jwtService.sign(classToPlain(payload)),
      expireAt,
    });
    return token;
  }

  setTokenCookie(req: Request, token: Identity) {
    req.res!.cookie(TOKEN_COOKIE_NAME, token.token, {
      expires: token.expireAt,
      httpOnly: true,
    });
  }
}
