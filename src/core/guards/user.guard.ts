import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { userStatut } from '../enums/user.enum';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt-user') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    if (!request.headers.authorization) {
      throw new UnauthorizedException('Token maquant.');
    }
    return super.canActivate(context);
  }
  handleRequest(err, user, info: Error) {
    if (info?.name === 'TokenExpiredError') {
      throw new UnauthorizedException('Token expiré.');
    }
    if (user.status === userStatut.Blocked) {
      throw new UnauthorizedException('Votre compte a ete blocké.');
    }

    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
