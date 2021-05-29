import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { ObjectId } from 'mongodb';
import { AdminAccountController } from './account.controller';
import { AdminService } from '../admin.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateAdminAccountDto } from './dto/update-admin-account.dto';

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
    it('should call service', async () => {
      const userId = 'userId';
      const dto: ChangePasswordDto = {
        currentPassword: 'currentPassword',
        newPassword: 'newPassword',
      };
      controller.changePassword(userId, dto);
      expect(adminService.changePassword).toHaveBeenCalledWith(userId, dto);
    });
  });

  describe('updateAdminSetting', () => {
    it('should return identity', async () => {
      const req = mock<Request>();
      const res = mock<Response>();
      res.set.mockReturnValue(res);
      req.res = res;

      const dto: UpdateAdminAccountDto = {
        displayName: 'John Smith',
        country: 'EN',
        description: 'description',
        gender: 'Male',
        avatar: '',
      };
      const userId = new ObjectId().toHexString();
      await expect(controller.updateAdminSetting(userId, dto)).resolves.toBeUndefined();
      expect(adminService.updateAdminSetting).toHaveBeenCalledWith(userId, dto);
    });
  });
});
