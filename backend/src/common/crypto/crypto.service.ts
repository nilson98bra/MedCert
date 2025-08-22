import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ICryptoService } from './crypt.service.interface';

@Injectable()
export class CryptoService implements ICryptoService {
  private readonly SALTS_ROUNDS = 10;

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.SALTS_ROUNDS);
    return bcrypt.hash(password, salt);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
