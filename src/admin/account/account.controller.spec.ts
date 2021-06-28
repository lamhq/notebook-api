import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { ObjectId } from 'mongodb';
import { AdminAccountController } from './account.controller';
import { AdminService } from '../admin.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

describe('AdminAccountController', () => {
  let controller: AdminAccountController;
  const authService = mock<AuthService>();
  const adminService = mock<AdminService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminAccountController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
        {
          provide: AdminService,
          useValue: adminService,
        },
      ],
    }).compile();
    controller = module.get<AdminAccountController>(AdminAccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAdminSetting', () => {
    it('should success', async () => {
      await expect(controller.getAdminSetting('id')).resolves.toBeUndefined();
      expect(adminService.findOneByIdOrFail).toHaveBeenCalledWith('id');
    });
  });

  describe('changePassword', () => {
    it('should success', async () => {
      const userId = 'userId';
      const dto: ChangePasswordDto = {
        currentPassword: 'currentPassword',
        newPassword: 'newPassword',
      };
      controller.changePassword(userId, dto);
      expect(adminService.changePassword).toHaveBeenCalledWith(userId, dto);
    });
  });

  describe('updateProfile', () => {
    it('should success', async () => {
      const req = mock<Request>();
      const res = mock<Response>();
      res.set.mockReturnValue(res);
      req.res = res;

      const dto: UpdateProfileDto = {
        displayName: 'John Smith',
        avatar: '',
      };
      const userId = new ObjectId().toHexString();
      await expect(controller.updateProfile(userId, dto)).resolves.toBeUndefined();
      expect(adminService.updateProfile).toHaveBeenCalledWith(userId, dto);
    });
  });

  describe('requestResetPassword', () => {
    it('should success', async () => {
      const data: ForgotPasswordDto = {
        email: 'abd@email.com',
      };
      await expect(controller.requestResetPassword(data)).resolves.toBeUndefined();
      expect(adminService.sendMailRequestResetPwd).toHaveBeenCalledWith(data);
    });
  });

  describe('resetPassword', () => {
    it('should success', async () => {
      const data: ResetPasswordDto = {
        token: 'token',
        password: 'password',
      };
      await expect(controller.resetPassword(data)).resolves.toBeUndefined();
      expect(adminService.resetPassword).toHaveBeenCalledWith(data);
    });
  });
});
