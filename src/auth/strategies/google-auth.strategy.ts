import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyFunction } from 'passport-http-bearer';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GoogleService } from 'auth/google/google.service';
import { AdminService } from 'admin/admin.service';

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly googleService: GoogleService, private adminService: AdminService) {
    super();
  }

  validate: VerifyFunction = async (token, done) => {
    const email = await this.googleService.getAccountEmail(token);
    const account = await this.adminService.findOneByEmail(email);
    if (!account) {
      done(new UnauthorizedException('No account found'));
      return;
    }
    done(undefined, account);
  };
}
