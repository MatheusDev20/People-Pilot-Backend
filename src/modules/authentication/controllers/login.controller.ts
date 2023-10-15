/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, HttpCode, Inject, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { LoginDTO, RefreshPayload } from '../DTOs/login-controller.dto';
import { authenticated } from 'src/helpers/http';
import { Utils } from '../utils/authentication.utils';
import { Authentication } from 'src/@types';

@Controller('auth')
export class AuthenticationController {
  constructor(@Inject('Authentication') private service: Authentication, private utils: Utils) {}
  @Post('/login')
  @HttpCode(200)
  async signIn(@Res({ passthrough: true }) response: Response, @Body() loginData: LoginDTO) {
    const { access_token, user, refreshToken } = await this.service.login(loginData);
    this.utils.setCookies(response, { access_token, refreshToken });
    const { password, ...sendUser } = user;

    return authenticated({ user: sendUser });
  }

  @Post('/refresh')
  @HttpCode(200)
  async refresh(
    @Res({ passthrough: true }) response: Response,
    @Body() refreshPayload: RefreshPayload,
  ) {
    const { access_token, refreshToken, user } = await this.service.refresh(
      refreshPayload.refreshToken,
    );
    this.utils.setCookies(response, { access_token, refreshToken });
    const { password, ...sendUser } = user;
    return authenticated({
      user: sendUser,
      strategy: 'AccessToken Gerado pelo usó único do Refresh Token',
    });
  }
}
