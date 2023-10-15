import { JwtData } from '../DTOs/jwt/jwt-dto';
import { CreateJwtData, JwtPayload } from '../DTOs/jwt/jwt-payload';

export type VerifyOptions = { refresh: boolean };

export interface JwtManager {
  generate(payload: CreateJwtData): Promise<Omit<JwtData, 'user'>>;
  verifyToken(token: string, options?: VerifyOptions): Promise<JwtPayload>;
}
