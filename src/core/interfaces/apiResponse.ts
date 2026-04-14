import { rolesUsers } from '../enums/user.enum';

export interface ApiResponse<T> {
  statusCode: number;
  message?: string;
  data?: T;
}
export interface responseLogin {
  access_token: string;
  refresh_token: string;
}
export interface allUsers {
  status: string;
  profilImage: string;
  name: string;
  firstName: string;
  lastName: string;
  sexe: string;
  email: string;
  telephone: string;
  role: rolesUsers;
  id: string;
}
