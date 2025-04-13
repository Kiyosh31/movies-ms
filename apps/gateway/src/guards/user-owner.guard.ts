import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class UserOwnerGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const requestedUserId = request.params.id; // ID del usuario *solicitado* en la ruta
    const authenticatedUser = request['user']; // El usuario autenticado

    // Si no hay usuario autenticado, deniega el acceso (esto debería ser manejado por el JwtAuthGuard)
    if (!authenticatedUser) {
      return false;
    }

    // Si no hay un ID de usuario solicitado en los parámetros, permite el acceso (ej: /users/me)
    // if (!requestedUserId) {
    //   return true;
    // }

    // Compara el ID del usuario autenticado con el ID solicitado
    if (authenticatedUser.id === requestedUserId) {
      return true; // El usuario está solicitando su propia información
    }

    // Aquí podrías agregar lógica para roles si es necesario
    // if (authenticatedUser.roles?.includes('admin')) {
    //   return true;
    // }

    // Si no es el mismo usuario y no tiene permisos, deniega el acceso
    throw new ForbiddenException(
      "You are not authorized to access this user's information",
    );
  }
}
