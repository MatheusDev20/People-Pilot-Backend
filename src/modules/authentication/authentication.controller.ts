import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthenticationController {
  @Get()
  async auth() {
    return new Promise((resolve) => resolve('Hello from auth'));
  }
}
