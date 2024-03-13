/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, HttpCode, Post, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { LoginDTO } from '../DTOs/login-controller.dto';
import { authenticated, ok } from 'src/helpers/http';
import { Utils } from '../utils/authentication.utils';
import { LoginUseCase } from '../use-cases/login-use-case';
import { RefreshTokenUseCase } from '../use-cases/refresh-token-use-case';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private loginUseCase: LoginUseCase,
    private utils: Utils,
    private refreshTokenUseCase: RefreshTokenUseCase,
  ) {}
  @Post('/login')
  @HttpCode(200)
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() loginData: LoginDTO,
  ) {
    const { access_token, user, refreshToken } =
      await this.loginUseCase.execute(loginData);

    this.utils.setCookies(response, { access_token, refreshToken });
    // const { password, ...sendUser } = user;

    return authenticated({ user: { ...user, password: null } });
  }

  @Post('/logout')
  async signOut(@Res({ passthrough: true }) response: Response) {
    this.utils.invalidateCookies(response);
    return ok({ logoutTime: new Date() });
  }

  @Post('/refresh')
  @HttpCode(200)
  async refresh(
    @Res({ passthrough: true }) response: Response,
    @Req() req: Request,
  ) {
    const token = req.cookies['refreshToken'];
    const { access_token, refreshToken, user } =
      await this.refreshTokenUseCase.execute(token);
    this.utils.setCookies(response, { access_token, refreshToken });
    const { password, ...sendUser } = user;
    return authenticated({
      user: sendUser,
      strategy: 'AccessToken Gerado pelo uso único do Refresh Token',
    });
  }
}
