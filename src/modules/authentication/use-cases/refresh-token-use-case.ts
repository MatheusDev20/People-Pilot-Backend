import { Inject, UnauthorizedException } from '@nestjs/common';
import { EmployeeRepository } from 'src/modules/employee/repositories/employee.repository';
import { RefreshTokenRepository } from 'src/modules/employee/repositories/refresh-token.repository';
import { JwtData } from 'src/modules/security/DTOs/jwt/jwt-dto';
import { JwtManager } from 'src/modules/security/interfaces/jwt';

export class RefreshTokenUseCase {
  constructor(
    private refreshTokenRepository: RefreshTokenRepository,
    private employeeRepository: EmployeeRepository,
    @Inject('JwtManager') private jwtManager: JwtManager,
  ) {}

  async execute(token: string): Promise<JwtData> {
    try {
      await this.jwtManager.verifyToken(token, { refresh: true });
      const existedToken = await this.refreshTokenRepository.find({
        where: { token },
      });
      if (!existedToken)
        throw new UnauthorizedException('Unauthorized Request');

      const user = existedToken.userId;
      const jwtData = await this.jwtManager.generate({
        username: user.name,
        sub: String(user.id),
      });

      const { refreshToken } = jwtData;

      /* Update the Refresh Token on the DB - Invalidate the old one */
      await this.employeeRepository.storeRefreshToken(user, refreshToken);

      return { ...jwtData, user, refreshToken };
    } catch (err) {
      throw new UnauthorizedException('Unauthorized Request');
    }
  }
}
