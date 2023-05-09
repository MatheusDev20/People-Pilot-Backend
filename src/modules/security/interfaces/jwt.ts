import { JwtData } from '../DTOs/jwt/jwt-dto';
import { JwtPayload } from '../DTOs/jwt/jwt-payload';

export interface JwtManager {
  generate(payload: JwtPayload): Promise<JwtData>;
}
