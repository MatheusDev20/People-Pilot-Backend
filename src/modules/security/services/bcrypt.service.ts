import { Injectable } from '@nestjs/common';
import { Hashing } from '../interfaces/hashing';
import { hash, compare } from 'bcrypt';
import { SALT_ROUNDS } from 'src/constants/constants';

@Injectable()
export class BcryptService implements Hashing {
  private salt = SALT_ROUNDS;

  async hash(plainText: string): Promise<string> {
    return hash(plainText, this.salt);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return await compare(value, hash);
  }
}
