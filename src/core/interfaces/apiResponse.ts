export interface ApiResponse<T> {
  statusCode: number;
  message?: string;
  data?: T;
}
export interface responseLogin {
  access_token: string;
  refresh_token: string;
}
