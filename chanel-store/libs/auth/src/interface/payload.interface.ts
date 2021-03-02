import { Role } from '@chanel-store/shared';

export interface JwtPayload {
  username: string;
  id: number;
  role: Role;
}
