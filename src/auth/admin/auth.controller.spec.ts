import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { AdminService } from 'src/admin/admin.service';
import { AdminAuthController } from './auth.controller';
import { AuthService } from '../auth.service';

describe('Auth Controller', () => {
  let controller: AdminAuthController;
  const authService = mock<AuthService>();
  const adminService = mock<AdminService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminAuthController],
      providers: [
        // mock jwtService
        {
          provide: AuthService,
          useValue: authService,
        },
        // mock userService
        {
          provide: AdminService,
          useValue: adminService,
        },
      ],
    }).compile();

    controller = module.get<AdminAuthController>(AdminAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
