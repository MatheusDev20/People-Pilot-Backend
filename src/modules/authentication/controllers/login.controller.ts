import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { LoginDTO } from '../DTOs/login-controller.dto';
import { AuthenticationService } from '../services/authentication.service';
import { authenticated } from 'src/helpers/http';
import { Utils } from '../utils/authentication.utils';

@Controller('auth')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService, private utils: Utils) {}
  @Post('/login')
  async signIn(@Res({ passthrough: true }) response: Response, @Body() loginData: LoginDTO) {
    const { access_token } = await this.authenticationService.signIn(loginData);
    this.utils.setCookies(response, { access_token });
    // TODO: Better response to auth
    return authenticated({ message: 'ok' });
  }
}
