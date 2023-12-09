import { Inject, UnauthorizedException } from '@nestjs/common';
import { EmployeeService } from 'src/modules/employee/services/employee.service';
import { JwtData } from 'src/modules/security/DTOs/jwt/jwt-dto';
import { JwtManager } from 'src/modules/security/interfaces/jwt';

export class RefreshTokenUseCase {
  constructor(
    private employeeService: EmployeeService,
    @Inject('JwtManager') private jwtManager: JwtManager,
  ) {}

  async execute(token: string): Promise<JwtData> {
    try {
      await this.jwtManager.verifyToken(token, { refresh: true });
      const existedToken = await this.employeeService.getRefreshToken(token);
      if (!existedToken) {
        console.log('?');
        throw new UnauthorizedException('Unauthorized Request');
      }

      const user = existedToken.userId;
      const jwtData = await this.jwtManager.generate({
        username: user.name,
        sub: String(user.id),
      });

      const { refreshToken } = jwtData;

      /* Update the Refresh Token on the DB - Invalidate the old one */
      await this.employeeService.storeRefreshToken(user, refreshToken);

      return { ...jwtData, user, refreshToken };
    } catch (err) {
      throw new UnauthorizedException('Unauthorized Request');
    }
  }
}
