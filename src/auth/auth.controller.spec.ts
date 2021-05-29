import { Test, TestingModule } from '@nestjs/testing';
import { mockDeep } from 'jest-mock-extended';
import { Request } from 'express';
import { AuthController } from './auth.controller';

describe('Auth Controller', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('logout', () => {
    it('should success', () => {
      const req = mockDeep<Request>();
      controller.logout(req);
      expect(req.res!.cookie).toHaveBeenCalledWith(
        'token',
        '',
        expect.objectContaining({
          expires: expect.any(Date),
          httpOnly: true,
        }),
      );
    });
  });
});
