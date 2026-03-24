export interface ApiResponse<T> {
  status: number;
  message?: string;
  data?: T;
}
export interface responseLogin {
  access_token: string;
  refresh_token: string;
}
