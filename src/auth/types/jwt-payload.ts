export interface JwtPayload {
  id: string;
  displayName: string;
  email: string;
  avatar?: string;
  roles?: string[];
}
