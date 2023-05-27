import { Injectable } from '@nestjs/common';
import { CookieData } from '../DTOs/cookie-data.dto';
import { Response } from 'express';
import { COOKIE_EXPIRATION } from 'src/constants/constants';

@Injectable()
export class Utils {
  setCookies(currResponse: Response, cookieData: CookieData) {
    const { access_token } = cookieData;
    currResponse.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false,
      expires: COOKIE_EXPIRATION,
    });
  }
}
