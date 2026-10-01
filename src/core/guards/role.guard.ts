import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { rolesUsers } from '../enums/user.enum';
import { ROLES_KEY } from '../decorators/role';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<rolesUsers[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles?.length) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user?.role?.length) {
      throw new ForbiddenException('Accès refusé.');
    }

    const hasRequiredRole = requiredRoles.some((role) =>
      user.role.includes(role),
    );

    if (!hasRequiredRole) {
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à accéder à cette ressource.",
      );
    }

    return true;
  }
}
