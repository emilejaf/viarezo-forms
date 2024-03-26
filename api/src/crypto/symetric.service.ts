import { Injectable } from '@nestjs/common';
import crypto from 'crypto';

export interface SymetricKey {
  key: Buffer;
  iv: Buffer;
}

@Injectable()
export class SymetricService {
  private alogrithm = 'aes-256-ctr';

  public newKey(): SymetricKey {
    return { key: crypto.randomBytes(32), iv: crypto.randomBytes(16) };
  }

  public encrypt(data: string, symetricKey: SymetricKey): Buffer {
    const cipher = crypto.createCipheriv(
      this.alogrithm,
      symetricKey.key,
      symetricKey.iv,
    );

    const encrypted = Buffer.concat([
      cipher.update(Buffer.from(data, 'utf-8')),
      cipher.final(),
    ]);

    return encrypted;
  }

  public decrypt(data: Buffer, symetricKey: SymetricKey): string {
    const decipher = crypto.createDecipheriv(
      this.alogrithm,
      symetricKey.key,
      symetricKey.iv,
    );

    const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);

    return decrypted.toString('utf-8');
  }
}
