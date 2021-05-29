import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { mock } from 'jest-mock-extended';
import { AuthService } from './auth.service';
import { JwtPayload } from './types/jwt-payload';

describe('AuthService', () => {
  let service: AuthService;
  const jwtService = mock<JwtService>();
  const configService = mock<ConfigService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        // mock jwtService
        {
          provide: JwtService,
          useValue: jwtService,
        },
        // mock configService
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createIdentity', () => {
    it('should return access token', () => {
      const jwtPayload: JwtPayload = { id: '1123', displayName: 'abcd', email: 'test@itads.net' };
      configService.get.mockReturnValueOnce('2h');
      jwtService.sign.mockReturnValueOnce('token');
      expect(service.createIdentity(jwtPayload)).toMatchObject({
        token: expect.any(String),
        expireAt: expect.any(Date),
      });
      expect(configService.get).toHaveBeenCalledWith('auth.accessTokenLifetime');
      expect(jwtService.sign).toHaveBeenLastCalledWith(jwtPayload);
    });
  });
});
