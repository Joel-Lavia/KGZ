import { audAuth, rolesUsers } from '../enums/user.enum';

export interface payloadUser {
  sub: string;
  userName?: string;
  role: rolesUsers[];
  aud: audAuth;
  iss: string;
  status: string;
}
