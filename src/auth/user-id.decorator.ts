import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { CustomParamFactory } from '@nestjs/common/interfaces';
import { AuthenticatedRequest } from './types/authenticated-request';

export const paramFactory: CustomParamFactory = (data: string, ctx: ExecutionContext) => {
  const request: AuthenticatedRequest = ctx.switchToHttp().getRequest();
  if (!request.user) {
    throw new UnauthorizedException();
  }
  return request.user.id;
};

export const UserId = createParamDecorator(paramFactory);
