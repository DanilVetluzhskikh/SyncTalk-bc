import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

const parseCookie = (str: string) =>
  str
    .split(';')
    .map((v) => v.split('='))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});

@Injectable()
export class JwtAuthSocket implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest().handshake.headers;

    try {
      const auth_token = parseCookie(req.cookie)['auth_token'];
      const str = auth_token.substring(2);
      const parsed = JSON.parse(str);
      const token = parsed.token;

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
