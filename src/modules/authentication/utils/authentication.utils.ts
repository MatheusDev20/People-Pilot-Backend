import { Injectable } from '@nestjs/common';
import { CookieData } from '../DTOs/cookie-data.dto';
import { Response } from 'express';

@Injectable()
export class Utils {
  setCookies(currResponse: Response, cookieData: CookieData) {
    const { access_token } = cookieData;
    currResponse.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false,
      expires: new Date(Date.now() + 60 * 60 * 1000), // TODO: Define a standart expiration time
    });
  }
}
