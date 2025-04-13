import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class ResourceOwnershipGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request['user']; // El payload del JWT ya adjuntado por el RolesGuard (o un AuthGuard previo)
    const resourceId = request.params.id; // Asumiendo que el ID del recurso está en los parámetros de la ruta

    if (!user) {
      throw new UnauthorizedException(
        'User information not found in the request',
      );
    }

    if (!resourceId) {
      return true; // Si no hay ID de recurso en los parámetros, permite (puede ser otra ruta)
    }

    if (user.sub === resourceId) {
      return true; // El ID del usuario en el token coincide con el ID del recurso
    }

    throw new ForbiddenException(
      'You do not have permission to access this resource',
    );
  }
}
