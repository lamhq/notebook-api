import { ExtractJwt, JwtFromRequestFunction, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AdminService } from 'src/admin/admin.service';
import { JwtPayload } from '../types/jwt-payload';

const extractJwtFromCookie: JwtFromRequestFunction = (req: Request) => {
  return req.cookies.token;
};

@Injectable()
export class AdminJwtAuthStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(configService: ConfigService, private adminService: AdminService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        extractJwtFromCookie,
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
