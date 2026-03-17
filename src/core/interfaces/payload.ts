import { rolesUsers } from '../enums/user.enum';

export interface payloadUser {
  id: string;
  userName?: string;
  role: rolesUsers[];
}
