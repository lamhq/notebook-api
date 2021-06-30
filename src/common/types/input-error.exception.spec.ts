import { ValidationError } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { InputErrorException } from './input-error.exception';

jest.mock('@nestjs/common', () => ({
  __esModule: true, // this property makes it work
  BadRequestException: jest.fn(),
}));
describe('InputErrorException', () => {
  it('should pass error object to BadRequestException', () => {
    // const constructor = jest.spyOn(common, 'BadRequestException');
    const errors: ValidationError[] = [
      { property: 'email', constraints: { anything: 'is required' }, children: [] },
      {
        property: 'addresses',
        children: [
          {
            property: '0',
            children: [
              { property: 'phone', constraints: { anything: 'is required' }, children: [] },
            ],
          },
        ],
      },
    ];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    try {
      throw new InputErrorException(errors);
      // eslint-disable-next-line no-empty
    } catch (error) {}
    expect(BadRequestException).toHaveBeenCalledWith({
      details: {
        email: 'is required',
        addresses: [{ phone: 'is required' }],
      },
    });
  });
});
