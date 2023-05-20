import { EmployeeService } from 'src/modules/employee/services/employee.service';
import { LoginDTO } from '../DTOs/login-controller.dto';
import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Hashing } from 'src/modules/security/interfaces/hashing';
import { InvalidCredentials, NotFoundEmail } from 'src/errors/messages';
import { JwtManager } from 'src/modules/security/interfaces/jwt';
import { CustomLogger } from 'src/modules/logger/services/logger.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private employeeService: EmployeeService,
    private logger: CustomLogger,
    @Inject('HashingService') private hashService: Hashing,
    @Inject('JwtManager') private jwtManager: JwtManager,
  ) {}
  async signIn(data: LoginDTO) {
    const { email, password } = data;
    const findUser = await this.employeeService.getByEmail(email);

    if (!findUser) throw new NotFoundException(NotFoundEmail);

    const isPasswordMatch = await this.hashService.compare(password, findUser.password);

    if (isPasswordMatch) {
      this.logger.generateJwtLog(findUser.id);
      return this.jwtManager.generate({
        username: findUser.name,
        sub: String(findUser.id),
      });
    }
    throw new UnauthorizedException(InvalidCredentials);
  }
}
