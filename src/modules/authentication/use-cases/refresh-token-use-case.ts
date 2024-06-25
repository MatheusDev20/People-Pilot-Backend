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

  async execute(refreshToken: string): Promise<JwtData> {
    // If i try to generate a new pair token/refreshToken and the refreshToken is not there, should throw an 401
    if (!refreshToken) throw new UnauthorizedException('Unauthorized Request');

    const token = refreshToken;

    try {
      await this.jwtManager.verifyToken(token, { refresh: true });
      const sessionUser = await this.refreshTokenRepository.find({
        where: { token },
        relations: ['user'],
      });

      // If there is a refreshToken, and the token is valid, but the session is not persisted in the RefreshToken table, should throw an 401
      if (!sessionUser) {
        throw new UnauthorizedException('Unauthorized Request');
      }
      console.log('sessionUser: ', sessionUser);
      const jwtData = await this.jwtManager.generate({
        username: sessionUser.user.name,
        sub: String(sessionUser.user.id),
      });

      const { refreshToken } = jwtData;

      /* Update the Refresh Token on the DB - Invalidate the old one */
      await this.employeeRepository.storeRefreshToken(
        sessionUser.user,
        refreshToken,
      );

      return { ...jwtData, user: sessionUser.user, refreshToken };
    } catch (err) {
      console.log('RefreshTokenUseCase Error: ', err);
      throw new UnauthorizedException('Unauthorized Request');
    }
  }
}
