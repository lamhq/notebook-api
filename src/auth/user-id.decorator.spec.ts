import { UnauthorizedException } from '@nestjs/common';
import { paramFactory } from './user-id.decorator';

describe('UserId', () => {
  const req = { user: { id: 'aaaa' } };
  const executionContext = {
    switchToHttp: jest.fn().mockReturnThis(),
    getRequest: jest.fn(),
  };

  it('should return user id', () => {
    executionContext.getRequest.mockReturnValueOnce({ user: { id: 'aaaa' } });
    expect(paramFactory('', executionContext)).toBe(req.user.id);
  });

  it('should throw exception when user is not logged', () => {
    executionContext.getRequest.mockReturnValueOnce({});
    expect(() => paramFactory('', executionContext)).toThrow(UnauthorizedException);
  });
});
