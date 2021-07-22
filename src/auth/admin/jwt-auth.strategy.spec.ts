import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { mock } from 'jest-mock-extended';
import { AdminService } from 'admin/admin.service';
import { Admin } from 'admin/admin.entity';
import { UnauthorizedException } from '@nestjs/common';
import { AdminJwtAuthStrategy } from './jwt-auth.strategy';
import { JwtPayload } from '../types/jwt-payload';

describe('AdminJwtAuthStrategy', () => {
  let strategy: AdminJwtAuthStrategy;
  const configService = mock<ConfigService>();
  const adminService = mock<AdminService>();

  beforeEach(async () => {
    configService.get.mockReturnValue('secret');
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminJwtAuthStrategy,
        // mock configService
        {
          provide: ConfigService,
          useValue: configService,
        },
        {
          provide: AdminService,
          useValue: adminService,
        },
      ],
    }).compile();

    strategy = module.get<AdminJwtAuthStrategy>(AdminJwtAuthStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should return jwt payload', async () => {
    const jwtPayload: JwtPayload = { id: '1123', displayName: 'abcd', email: 'test@itads.net' };
    adminService.findOneByEmail.mockResolvedValue(mock<Admin>());
    const result = await strategy.validate(jwtPayload);
    expect(result).toBe(jwtPayload);
  });

  it('should throw unauthorize', async () => {
    const jwtPayload: JwtPayload = { id: '1123', displayName: 'abcd', email: 'test@itads.net' };
    adminService.findOneByEmail.mockResolvedValue(undefined);
    await expect(strategy.validate(jwtPayload)).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
