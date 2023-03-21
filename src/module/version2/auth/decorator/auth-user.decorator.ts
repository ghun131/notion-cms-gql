import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlContextType } from '@nestjs/graphql';
import get from 'lodash/get';

export const AuthUser = createParamDecorator(
  async (data: string, ctx: ExecutionContext) => {
    let userId: string;
    if (ctx.getType<GqlContextType>() === 'graphql') {
      const request = ctx.getArgByIndex(2);
      userId = get(request, 'req.headers.userid', '');
    }
    if (!userId) {
      throw new UnauthorizedException('userId is missing');
    }
    return userId;
  },
);
