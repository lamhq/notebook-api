import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import { AdminService } from 'src/admin/admin.service';
import { Admin } from 'src/admin/admin.entity';
import { PASSWORD_INPUT_ERROR } from 'src/common/constants/error';
import { InputErrorException } from 'src/common/types/input-error.exception';

@Injectable()
// With @nestjs/passport, you configure a Passport strategy by extending the PassportStrategy class.
export class AdminLocalAuthStrategy extends PassportStrategy(Strategy, 'admin-local') {
  // You pass the strategy options by calling the super() method in your subclass,
  constructor(private adminService: AdminService, private commonService: CommonService) {
    super({ usernameField: 'email' });
  }

  // You provide the verify callback by implementing a validate() method in your subclass.
  async validateAdmin(username: string, pass: string): Promise<Admin | undefined> {
    const admin = await this.adminService.findOneByEmail(username);
    if (admin) {
      const isPwdValid = await this.commonService.comparePassword(pass, admin.password);
      if (isPwdValid) return admin;
    }
    return undefined;
  }

  async validate(username: string, password: string): Promise<Admin | undefined> {
    const admin = await this.validateAdmin(username, password);
    if (!admin) {
      throw new InputErrorException({ currentPassword: PASSWORD_INPUT_ERROR });
    }
    return admin;
  }
}
