import { LoginDTO } from '../DTOs/login-controller.dto';
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Hashing } from 'src/modules/security/interfaces/hashing';
import { InvalidCredentials, NotFoundEmail } from 'src/errors/messages';
import { JwtManager } from 'src/modules/security/interfaces/jwt';
import { JwtData } from 'src/modules/security/DTOs/jwt/jwt-dto';
import { EmployeeRepository } from 'src/modules/employee/repositories/employee.repository';

@Injectable()
export class LoginUseCase {
  constructor(
    private employeeRepository: EmployeeRepository,
    @Inject('HashingService') private hashService: Hashing,
    @Inject('JwtManager') private jwtManager: JwtManager,
  ) {}

  async execute(data: LoginDTO): Promise<JwtData> {
    const { email, password } = data;

    const findUser = await this.employeeRepository.find(
      { where: { email } },
      { role: true },
    );

    if (!findUser) throw new NotFoundException(NotFoundEmail);
    const { role, name, id } = findUser;

    if (role.name === 'employee')
      throw new UnauthorizedException('Unauthorized Request');

    if (await this.hashService.compare(password, findUser.password)) {
      const jwtData = await this.jwtManager.generate({
        username: name,
        sub: String(id),
      });

      const { refreshToken } = jwtData;
      await this.employeeRepository.storeRefreshToken(findUser, refreshToken);

      return { ...jwtData, user: findUser, refreshToken };
    }

    throw new UnauthorizedException(InvalidCredentials);
  }
}
