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
      // sameSite: 'none',
      // expires: COOKIE_EXPIRATION_NEW,
      // maxAge: 55 * 60 * 1000, // 55 min
      // 1 min of max age
      maxAge: 1 * 60 * 1000, // 1 min
      // maxAge: 120000, // 3min tst
    });

    currResponse.cookie('refreshToken', cookieData.refreshToken, {
      httpOnly: true,
      secure: false,
      // sameSite: 'none',
      maxAge: 1 * 24 * 60 * 60 * 1000, // 2 days
      // maxAge: 180000, // 3min tst
    });
  }

  invalidateCookies(currResponse: Response): void {
    currResponse.cookie('access_token', '', {
      httpOnly: true,
      secure: false,
      maxAge: 5000,
    });

    currResponse.cookie('refreshToken', '', {
      httpOnly: true,
      secure: false,
      maxAge: 5000,
    });
  }
}
