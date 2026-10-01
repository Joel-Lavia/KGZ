import { SetMetadata } from '@nestjs/common';
import { rolesUsers } from '../enums/user.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: rolesUsers[]) => SetMetadata(ROLES_KEY, roles);
