import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mock } from 'jest-mock-extended';
import { MongoRepository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import { ObjectId } from 'mongodb';
import { AdminService } from './admin.service';
import { Admin } from './admin.entity';
import { ChangePasswordDto } from './account/dto/change-password.dto';
import { UpdateAdminAccountDto } from './account/dto/update-admin-account.dto';

describe('AdminService', () => {
  let service: AdminService;
  const adminRepository = mock<MongoRepository<Admin>>();
  const commonService = mock<CommonService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: getRepositoryToken(Admin),
          useValue: adminRepository,
        },
        // mock commonService
        {
          provide: CommonService,
          useValue: commonService,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneByEmail', () => {
    it('should return user', async () => {
      const user = new Admin({ email: 'abc@m.mm' });
      adminRepository.findOne.mockResolvedValueOnce(user);
      await expect(service.findOneByEmail(user.email)).resolves.toBeDefined();
      expect(adminRepository.findOne).toHaveBeenCalledWith({ email: user.email });
    });
  });

  describe('findOneByEmailOrFail', () => {
    it('should throw not found exception', async () => {
      adminRepository.findOneOrFail.mockRejectedValueOnce(false);
      await expect(service.findOneByEmailOrFail('email@email.com')).rejects.toEqual(
        expect.any(NotFoundException),
      );
      expect(adminRepository.findOneOrFail).toHaveBeenCalledWith({ email: 'email@email.com' });
    });
  });

  describe('findOneByIdOrFail', () => {
    it('should throw not found exception', async () => {
      adminRepository.findOneOrFail.mockRejectedValueOnce(false);
      await expect(service.findOneByIdOrFail('userId')).rejects.toEqual(
        expect.any(NotFoundException),
      );
      expect(adminRepository.findOneOrFail).toHaveBeenCalledWith('userId');
    });
  });

  describe('changePassword', () => {
    it('should call service', async () => {
      const userId = new ObjectId().toHexString();
      const dto: ChangePasswordDto = {
        currentPassword: 'currentPassword',
        newPassword: 'newPassword',
      };
      const savedAdmin = mock<Admin>();
      adminRepository.findOne.mockResolvedValueOnce(savedAdmin);
      commonService.comparePassword.mockResolvedValueOnce(true);
      commonService.hashPassword.mockResolvedValueOnce(dto.newPassword);
      await service.changePassword(userId, dto);
      expect(adminRepository.updateOne).toHaveBeenCalled();
    });

    it('should throw notfound exception', async () => {
      const userId = new ObjectId().toHexString();
      const dto: ChangePasswordDto = {
        currentPassword: 'currentPassword',
        newPassword: 'newPassword',
      };
      adminRepository.findOne.mockResolvedValueOnce(undefined);
      await expect(service.changePassword(userId, dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw bad request exception', async () => {
      const userId = new ObjectId().toHexString();
      const dto: ChangePasswordDto = {
        currentPassword: 'currentPassword',
        newPassword: 'newPassword',
      };
      const user = mock<Admin>();
      adminRepository.findOne.mockResolvedValueOnce(user);
      commonService.comparePassword.mockResolvedValueOnce(false);
      await expect(service.changePassword(userId, dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateSellerSetting', () => {
    it('should update', async () => {
      const dto: UpdateAdminAccountDto = {
        displayName: 'John Smith',
        country: 'EN',
        description: 'description',
        gender: 'Male',
        avatar: 'avatar',
      };

      const userId = new ObjectId();
      const admin: Admin = {
        id: userId,
        email: '',
        displayName: 'John Smith',
        password: 'abc',
        avatar: 'abc',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const findOneByIdOrFail = jest.spyOn(service, 'findOneByIdOrFail');
      findOneByIdOrFail.mockResolvedValueOnce(admin);

      const hashPassword = jest.spyOn(commonService, 'comparePassword');
      hashPassword.mockResolvedValueOnce(true);

      await service.updateAdminSetting(userId.toHexString(), dto);
      expect(adminRepository.updateOne).toHaveBeenCalled();
    });
  });
});
