import { Body, Controller, Post } from '@nestjs/common';
import { LoginDTO } from '../DTOs/login-controller.dto';
import { AuthenticationService } from '../services/authentication.service';

@Controller('auth')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}
  @Post('/login')
  async signIn(@Body() loginData: LoginDTO) {
    return await this.authenticationService.signIn(loginData);
  }
}
