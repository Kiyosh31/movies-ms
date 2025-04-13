import {
  UseGuards,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

export const Auth = () => UseGuards(JwtAuthGuard);

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user; // Access the user object attached by the guard
  },
);
