import { Injectable } from '@nestjs/common';
import { CookieData } from '../DTOs/cookie-data.dto';
import { Response } from 'express';

@Injectable()
export class Utils {
  setCookies(currResponse: Response, cookieData: CookieData): void {
    const { access_token } = cookieData;
    currResponse.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false,
      // expires: COOKIE_EXPIRATION_NEW,
      maxAge: 60 * 1000 * 1000,
    });

    currResponse.cookie('refreshToken', cookieData.refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 1000 * 1000,
    });
  }
}
