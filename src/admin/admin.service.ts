import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { CommonService } from 'common/common.service';
import { MongoRepository } from 'typeorm';
import { InputErrorException } from 'common/types/input-error.exception';
import { ChangePasswordDto } from './account/dto/change-password.dto';
import { UpdateProfileDto } from './account/dto/update-profile.dto';
import { Admin } from './admin.entity';
import { ForgotPasswordDto } from './account/dto/forgot-password.dto';
import { ResetPasswordDto } from './account/dto/reset-password.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) private adminRepository: MongoRepository<Admin>,
    private readonly commonService: CommonService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async findOneByEmail(email: string): Promise<Admin | undefined> {
    return this.adminRepository.findOne({ email });
  }

  async findOneByEmailOrFail(email: string): Promise<Admin> {
    try {
      const user = await this.adminRepository.findOneOrFail({ email });
      return user;
    } catch (error) {
      throw new NotFoundException('Account not found');
    }
  }

  async findOneById(id: string): Promise<Admin | undefined> {
    return this.adminRepository.findOne(id);
  }

  async findOneByIdOrFail(id: string): Promise<Admin> {
    try {
      const user = await this.adminRepository.findOneOrFail(id);
      return user;
    } catch (error) {
      throw new NotFoundException('Account not found');
    }
  }

  async changePassword(id: string, data: ChangePasswordDto): Promise<void> {
    const user = await this.adminRepository.findOne(id);
    if (!user) throw new NotFoundException();
    const isPwdValid = await this.commonService.comparePassword(
      data.currentPassword,
      user.password,
    );
    if (!isPwdValid) {
      throw new InputErrorException({ currentPassword: 'Current password is wrong' });
    }
    user.password = await this.commonService.hashPassword(data.newPassword);

    await this.adminRepository.updateOne({ _id: new ObjectId(id) }, { $set: user });
  }

  async updateProfile(id: string, data: UpdateProfileDto): Promise<void> {
    await this.findOneByIdOrFail(id);
    const updateDoc: Partial<Admin> = {
      displayName: data.displayName,
      avatar: data.avatar,
    };

    await this.adminRepository.updateOne({ _id: new ObjectId(id) }, { $set: updateDoc });
  }

  async sendMailRequestResetPwd(data: ForgotPasswordDto): Promise<void> {
    const user = await this.findOneByEmail(data.email);
    if (!user) {
      throw new InputErrorException({ email: 'This email does not exist in our system.' });
    }
    const duration = await this.configService.get<string>('auth.resetPasswordTokenLifetime');
    const appName = this.configService.get<string>('appName');
    const webUrl = this.configService.get<string>('webUrl');
    const q = this.commonService.createToken(user.id.toHexString(), duration);
    const link = `${webUrl}/reset-pwd?token=${q}`;
    const message: ISendMailOptions = {
      to: `${user.displayName} <${user.email}>`,
      subject: `${appName} - Password reset request`,
      template: './reset-password',
      context: {
        appName,
        link,
      },
    };
    await this.mailerService.sendMail(message);
  }

  async resetPassword(data: ResetPasswordDto): Promise<void> {
    let id: string;
    try {
      id = this.commonService.verifyToken(data.token);
    } catch (error) {
      throw new BadRequestException('Reset password token is invalid or expired.');
    }
    await this.findOneByIdOrFail(id);
    const updateDoc: Partial<Admin> = {
      password: await this.commonService.hashPassword(data.password),
    };
    await this.adminRepository.updateOne({ _id: new ObjectId(id) }, { $set: updateDoc });
  }
}
