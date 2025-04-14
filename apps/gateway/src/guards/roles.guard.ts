import { Role } from '@app/common';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // No specific roles required, allow access
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      return false; // No user object or role found in the request
    }

    return requiredRoles.some((role) => user.role === role);
  }
}
