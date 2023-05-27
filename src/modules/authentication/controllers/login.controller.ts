import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { LoginDTO } from '../DTOs/login-controller.dto';
import { authenticated } from 'src/helpers/http';
import { Utils } from '../utils/authentication.utils';
import { Authentication } from 'src/@types';

@Controller('auth')
export class AuthenticationController {
  constructor(@Inject('Authentication') private service: Authentication, private utils: Utils) {}
  @Post('/login')
  async signIn(@Res({ passthrough: true }) response: Response, @Body() loginData: LoginDTO) {
    const { access_token } = await this.service.signIn(loginData);
    this.utils.setCookies(response, { access_token });
    // TODO: Better response to auth
    return authenticated({ message: 'ok' });
  }
}
