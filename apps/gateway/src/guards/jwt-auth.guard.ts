import {
  USERS_SERVICE_NAME,
  UsersServiceClient,
  VerifyJwtResponse,
} from '@app/common';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private userService: UsersServiceClient;

  constructor(
    @Inject(USERS_SERVICE_NAME) private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userService =
      this.client.getService<UsersServiceClient>(USERS_SERVICE_NAME);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid authorization header');
    }

    const token = authHeader.substring(7); // Extract the token

    if (!token) {
      throw new UnauthorizedException('No JWT token provided');
    }

    try {
      const verificationResult: VerifyJwtResponse | undefined =
        await this.userService.verifyJwt({ token }).toPromise();

      if (verificationResult && verificationResult.isValid) {
        request['user'] = { id: verificationResult.user?.id };
        return true;
      } else {
        throw new UnauthorizedException('Invalid JWT token');
      }
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }
}
