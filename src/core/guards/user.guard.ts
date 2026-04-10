import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { userStatut } from '../enums/user.enum';
import { IS_PUBLIC_KEY } from '../decorators/PublicPath';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt-user') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    //=================FOR PUBLIC PATH=========================================
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    //========================================================================
    if (!request.headers.authorization) {
      throw new UnauthorizedException('Token maquant.');
    }
    return super.canActivate(context);
  }
  handleRequest(err, user, info: Error) {
    if (info?.name === 'TokenExpiredError') {
      throw new UnauthorizedException('Token expiré.');
    }
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    if (user.status === userStatut.Blocked) {
      throw new UnauthorizedException('Votre compte a ete blocké.');
    }

    return user;
  }
}
