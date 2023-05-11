import { JwtData } from '../DTOs/jwt/jwt-dto';
import { CreateJwtData, JwtPayload } from '../DTOs/jwt/jwt-payload';

export interface JwtManager {
  generate(payload: CreateJwtData): Promise<JwtData>;
  verifyToken(token: string): Promise<JwtPayload>;
}
