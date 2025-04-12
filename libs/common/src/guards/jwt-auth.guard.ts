// auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';
import { USERS_SERVICE_NAME } from '../proto-gen';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(USERS_SERVICE_NAME) private readonly authService: ClientProxy,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Permitir acceso a rutas públicas marcadas con @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    // Verificar si el contexto es HTTP
    if (context.getType() !== 'http') {
      return true; // Saltar la validación si no es una solicitud HTTP
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      throw new UnauthorizedException('No Bearer token found');
    }

    try {
      // Opción 1: Comunicarse con el servicio de autenticación
      const user = await this.authService
        .send('auth.validate_token', { token })
        .toPromise();
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }
      request.user = user; // Adjuntar la información del usuario a la solicitud HTTP

      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token: ', err);
    }
  }
}
