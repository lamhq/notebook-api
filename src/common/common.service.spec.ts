import { Test, TestingModule } from '@nestjs/testing';
import bcrypt from 'bcrypt';
import { useContainer, MetadataStorage } from 'class-validator';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { mock } from 'jest-mock-extended';
import { JwtService } from '@nestjs/jwt';
import { Counter } from './counter.entity';
import { CommonService } from './common.service';

describe('CommonService', () => {
  let service: CommonService;
  let metadataStorage: MetadataStorage;
  const counterRepository = mock<MongoRepository<Counter>>();
  const jwtService = mock<JwtService>();

  beforeEach(async () => {
    metadataStorage = new MetadataStorage();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommonService,
        {
          provide: MetadataStorage,
          useValue: metadataStorage,
        },
        {
          provide: getRepositoryToken(Counter),
          useValue: counterRepository,
        },
        // mock jwtService
        {
          provide: JwtService,
          useValue: jwtService,
        },
      ],
    }).compile();
    useContainer(module, { fallback: true, fallbackOnErrors: true });
    service = module.get<CommonService>(CommonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hashPassword', () => {
    it('should return hashed value', () => {
      const mHash = jest.spyOn(bcrypt, 'hash');
      mHash.mockImplementationOnce(() => Promise.resolve('hashed'));
      expect(service.hashPassword('1234')).toBeDefined();
      expect(mHash).toHaveBeenCalledWith('1234', 9);
    });
  });

  describe('comparePassword', () => {
    it('should compare password', async () => {
      const mCompare = jest.spyOn(bcrypt, 'compare');
      mCompare.mockImplementationOnce(() => Promise.resolve(true));
      await expect(service.comparePassword('1234', 'hashed')).resolves.toBe(true);
      expect(mCompare).toHaveBeenCalledWith('1234', 'hashed');
      mCompare.mockRestore();
    });
  });

  describe('generateCode', () => {
    it('should return generated code', async () => {
      counterRepository.findOneAndUpdate.mockResolvedValueOnce({ value: { value: 1234 } });
      await expect(service.generateCode(undefined, 5, 'P')).resolves.toBe('P01234');
      expect(counterRepository.findOneAndUpdate).toHaveBeenCalledWith(
        { type: 'DEFAULT' },
        { $inc: { value: 1 } },
        { upsert: true, returnOriginal: false },
      );
    });
  });

  describe('createToken', () => {
    it('should create token', () => {
      jwtService.sign.mockClear();
      jwtService.sign.mockReturnValueOnce('token');
      const id = 'id';

      expect(service.createToken(id)).toEqual('token');
      expect(jwtService.sign).toHaveBeenLastCalledWith({ id }, { expiresIn: '3days' });
    });
  });

  describe('verifyToken', () => {
    it('should verify token', () => {
      const id = 'id';
      jwtService.verify.mockReturnValueOnce({ id });
      expect(service.verifyToken('token')).toEqual(id);
      expect(jwtService.verify).toHaveBeenCalledWith('token');
    });
  });
});
