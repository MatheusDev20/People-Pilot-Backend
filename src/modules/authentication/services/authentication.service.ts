import { EmployeeService } from 'src/modules/employee/services/employee.service';
import { LoginDTO } from '../DTOs/login-controller.dto';
import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Hashing } from 'src/modules/security/interfaces/hashing';
import { InvalidCredentials, NotFoundEmail } from 'src/errors/messages';
import { JwtManager } from 'src/modules/security/interfaces/jwt';
import { CustomLogger } from 'src/modules/logger/services/logger.service';
import { Authentication } from 'src/@types';
import { JwtData } from 'src/modules/security/DTOs/jwt/jwt-dto';

@Injectable()
export class AuthenticationService implements Authentication {
  constructor(
    private employeeService: EmployeeService,
    private logger: CustomLogger,
    @Inject('HashingService') private hashService: Hashing,
    @Inject('JwtManager') private jwtManager: JwtManager,
  ) {}
  async login(data: LoginDTO): Promise<JwtData> {
    const { email, password } = data;
    const findUser = await this.employeeService.find('email', email);
    if (!findUser) throw new NotFoundException(NotFoundEmail);

    const { id, name } = findUser;

    if (await this.hashService.compare(password, findUser.password)) {
      this.logger.generateJwtLog(id);
      const jwtData = await this.jwtManager.generate({
        username: name,
        sub: String(id),
      });
      return { ...jwtData, user: findUser };
    }

    throw new UnauthorizedException(InvalidCredentials);
  }
}
