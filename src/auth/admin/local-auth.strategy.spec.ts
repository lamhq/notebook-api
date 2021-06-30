import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { BadRequestException } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import { ObjectId } from 'mongodb';
import { AdminService } from 'src/admin/admin.service';
import { Admin } from 'src/admin/admin.entity';
import { AdminLocalAuthStrategy } from './local-auth.strategy';
import { CreateTokenDto } from '../dto/create-token-dto';

describe('AdminLocalAuthStrategy', () => {
  let strategy: AdminLocalAuthStrategy;
  const adminService = mock<AdminService>();
  const commonService = mock<CommonService>();
  const admin = mock<Admin>({
    id: new ObjectId('59b39bcf538ff606c04d12db'),
    password: 'hashed',
  });
  const formData: CreateTokenDto = {
    email: 'john@example.com',
    password: 'password',
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminLocalAuthStrategy,
        {
          provide: AdminService,
          useValue: adminService,
        },
        {
          provide: CommonService,
          useValue: commonService,
        },
      ],
    }).compile();
    strategy = module.get<AdminLocalAuthStrategy>(AdminLocalAuthStrategy);
    adminService.findOneByEmail.mockReset();
    commonService.comparePassword.mockReset();
  });
  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });
  it('should return admin from email and password', async () => {
    adminService.findOneByEmail.mockResolvedValue(admin);
    commonService.comparePassword.mockResolvedValue(true);
    await expect(strategy.validate(formData.email, formData.password)).resolves.toBe(admin);
    expect(adminService.findOneByEmail).toHaveBeenCalledWith(formData.email);
    expect(commonService.comparePassword).toHaveBeenCalledWith(formData.password, admin.password);
  });
  it('should throw exception when admin is not found', async () => {
    adminService.findOneByEmail.mockResolvedValue(undefined);
    await expect(strategy.validate(formData.email, formData.password)).rejects.toEqual(
      expect.any(BadRequestException),
    );
    expect(adminService.findOneByEmail).toHaveBeenCalledWith(formData.email);
    expect(commonService.comparePassword).not.toHaveBeenCalled();
  });
  it('should throw exception when password is wrong', async () => {
    adminService.findOneByEmail.mockResolvedValue(admin);
    commonService.comparePassword.mockResolvedValue(false);
    await expect(strategy.validate('john@example.com', 'password')).rejects.toEqual(
      expect.any(BadRequestException),
    );
    expect(adminService.findOneByEmail).toHaveBeenCalledWith('john@example.com');
    expect(commonService.comparePassword).toHaveBeenCalledWith(formData.password, admin.password);
  });
});
