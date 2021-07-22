import { ExtractJwt, JwtFromRequestFunction, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AdminService } from 'admin/admin.service';
import { TOKEN_COOKIE_NAME } from 'common/constants/auth';
import { JwtPayload } from '../types/jwt-payload';

function extractJwtFromCookie(name: string): JwtFromRequestFunction {
  return (req: Request) => req.cookies[name];
}

@Injectable()
export class AdminJwtAuthStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(configService: ConfigService, private adminService: AdminService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        extractJwtFromCookie(TOKEN_COOKIE_NAME),
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.secret'),
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    const admin = await this.adminService.findOneByEmail(payload.email);

    if (!admin) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
