import { Injectable } from '@nestjs/common';
import { Hashing } from '../interfaces/hashing';
import { hash } from 'bcrypt';

@Injectable()
export class BcryptService implements Hashing {
  private salt = 10;

  async hash(plainText: string): Promise<string> {
    return hash(plainText, this.salt);
  }
}
