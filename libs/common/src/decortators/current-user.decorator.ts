import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from 'apps/users/src/services/users/models/user.schema';

const getCurrentUserbyContext = (context: ExecutionContext): UserDocument => {
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest().user;
  }

  const user = context.getArgs()[2]?.req.headers?.user;
  if (!user) {
  }

  return JSON.parse(user);
};

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) =>
    getCurrentUserbyContext(context),
);
