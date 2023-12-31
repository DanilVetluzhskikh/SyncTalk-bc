import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuth implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    try {
      const token = req.cookies['auth_token'].token;

      if (!token) {
        throw new UnauthorizedException({
          message: 'Пользователь не авторизован',
        });
      }

      const user = this.jwtService.verify(token);

      req.user = {
        email: user.email,
        id: user.id,
      };

      return true;
    } catch (e) {
      console.log(e, 'e');
      throw new UnauthorizedException({
        message: 'Пользователь не авторизован',
      });
    }
  }
}
