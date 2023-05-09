import { EmployeeService } from 'src/modules/employee/services/employee.service';
import { LoginDTO } from '../DTOs/login-controller.dto';
import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Hashing } from 'src/modules/security/interfaces/hashing';
import { InvalidCredentials, NotFoundEmail } from 'src/errors/messages';
import { JwtManager } from 'src/modules/security/interfaces/jwt';

@Injectable()
export class AuthenticationService {
  private logger = new Logger();

  constructor(
    private employeeService: EmployeeService,
    @Inject('HashingService') private hashService: Hashing,
    @Inject('JwtManager') private jwtManager: JwtManager,
  ) {}
  async signIn(data: LoginDTO) {
    const { email, password } = data;
    const findUser = await this.employeeService.getByEmail(email);
    if (!findUser) throw new NotFoundException(NotFoundEmail);

    const isPasswordMatch = await this.hashService.compare(
      password,
      findUser.password,
    );

    this.logger.log(
      `\n Generating a new JWT for user ${
        findUser.id
      } \n Date: ${new Date()} \n Expiration: 1h`,
    );

    if (isPasswordMatch) {
      return this.jwtManager.generate({
        username: findUser.name,
        sub: String(findUser.id),
      });
    }

    throw new UnauthorizedException(InvalidCredentials);
  }
}
