import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mock } from 'jest-mock-extended';
import { MongoRepository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommonService } from 'common/common.service';
import { ObjectId } from 'mongodb';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { InputErrorException } from 'common/types/input-error.exception';
import { AdminService } from './admin.service';
import { Admin } from './admin.entity';
import { ChangePasswordDto } from './account/dto/change-password.dto';
import { UpdateProfileDto } from './account/dto/update-profile.dto';
import { ForgotPasswordDto } from './account/dto/forgot-password.dto';
import { ResetPasswordDto } from './account/dto/reset-password.dto';

describe('AdminService', () => {
  let service: AdminService;
  const adminRepository = mock<MongoRepository<Admin>>();
  const commonService = mock<CommonService>();
  const configService = mock<ConfigService>();
  const mailerService = mock<MailerService>();

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
        // mock configService
        {
          provide: ConfigService,
          useValue: configService,
        },
        // mock mailerService
        {
          provide: MailerService,
          useValue: mailerService,
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
    it('should success', async () => {
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

  describe('updateProfile', () => {
    it('should success', async () => {
      const dto: UpdateProfileDto = {
        displayName: 'John Smith',
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

      await service.updateProfile(userId.toHexString(), dto);
      expect(adminRepository.updateOne).toHaveBeenCalled();
    });
  });

  describe('sendMailRequestResetPwd', () => {
    const data: ForgotPasswordDto = {
      email: 'test@mail.com',
    };

    it('should success', async () => {
      const admin: Admin = {
        id: new ObjectId(),
        displayName: 'admin',
        email: 'test@mail.com',
      } as Admin;
      const findOneByEmail = jest.spyOn(service, 'findOneByEmail');
      findOneByEmail.mockResolvedValueOnce(admin);
      configService.get
        .mockReturnValueOnce('2d')
        .mockReturnValueOnce('Notebook')
        .mockReturnValueOnce('http://notebook.com');
      commonService.createToken.mockReturnValueOnce('token');

      await service.sendMailRequestResetPwd(data);
      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: `${admin.displayName} <${admin.email}>`,
        subject: 'Password reset request',
        template: './reset-password',
        context: {
          appName: 'Notebook',
          link: 'http://notebook.com/reset-pwd?token=token',
        },
      });
      expect(findOneByEmail).toHaveBeenCalledWith(data.email);
      findOneByEmail.mockRestore();
    });

    it('should throw exception when email does not exist', async () => {
      const findOneByEmail = jest.spyOn(service, 'findOneByEmail');
      findOneByEmail.mockResolvedValueOnce(undefined);
      await expect(service.sendMailRequestResetPwd(data)).rejects.toEqual(
        expect.any(InputErrorException),
      );
      findOneByEmail.mockRestore();
    });
  });

  describe('resetPassword', () => {
    const data: ResetPasswordDto = {
      token: 'token',
      password: 'password',
    };

    it('should success', async () => {
      const id = '5f9550e2f0d5c00715568108';
      commonService.verifyToken.mockReturnValueOnce(id);
      const findOneByIdOrFail = jest.spyOn(service, 'findOneByIdOrFail');
      findOneByIdOrFail.mockResolvedValueOnce({} as Admin);
      commonService.hashPassword.mockResolvedValueOnce('hashpwd');

      await expect(service.resetPassword(data)).resolves.toBeUndefined();
      expect(adminRepository.updateOne).toHaveBeenCalledWith(
        { _id: new ObjectId(id) },
        {
          $set: { password: 'hashpwd' },
        },
      );

      findOneByIdOrFail.mockRestore();
    });

    it('should throw exception', async () => {
      commonService.verifyToken.mockImplementationOnce(() => {
        throw new Error();
      });
      await expect(service.resetPassword(data)).rejects.toEqual(expect.any(BadRequestException));
    });
  });
});
