import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlContextType } from '@nestjs/graphql';
import get from 'lodash/get';

export const AuthUser = createParamDecorator(
  async (data: string, ctx: ExecutionContext) => {
    let clientName: string;
    if (ctx.getType<GqlContextType>() === 'graphql') {
      const request = ctx.getArgByIndex(2);
      clientName = get(request, 'req.headers.notionclientname', '');
    }
    if (!clientName) {
      throw new UnauthorizedException('Notion Client Name is missing');
    }
    return clientName;
  },
);
