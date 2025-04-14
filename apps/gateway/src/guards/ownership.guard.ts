import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class OwnershipGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userIdFromParams = request.params.id; // Assuming the user ID is in the route params as 'id'
    const authenticatedUserId = request.user?.id;
    const authenticatedUserRole = request.user?.role;

    if (!authenticatedUserId) {
      return false; // Should be handled by JwtAuthGuard, but for safety
    }

    // Allow access if the requested resource belongs to the authenticated user
    if (authenticatedUserId === userIdFromParams) {
      return true;
    }

    throw new ForbiddenException(
      'You do not have permission to access this resource.',
    );
  }
}
