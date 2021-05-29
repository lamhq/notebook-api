import { Injectable } from '@nestjs/common';
import ms from 'ms';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
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
      token: this.jwtService.sign(payload),
      expireAt,
      id: payload.id,
    });
    return token;
  }
}
