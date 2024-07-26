export interface JwtTokenInterface {
  id: string;
  roleId: string;
  exp?: number;
  iat?: number;
}
