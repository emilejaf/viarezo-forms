import { Injectable } from '@nestjs/common';
import { promisify } from 'util';
import crypto from 'crypto';

@Injectable()
export class SigningService {
  private generateKeyPair = promisify(crypto.generateKeyPair);

  public async newKeyPair() {
    return await this.generateKeyPair('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });
  }

  public sign(data: string, privateKey: crypto.KeyLike): Buffer {
    return crypto.sign('RSA-SHA256', Buffer.from(data, 'base64'), privateKey);
  }

  public verify(
    data: string,
    signature: Buffer,
    publicKey: crypto.KeyLike,
  ): boolean {
    return crypto.verify(
      'RSA-SHA256',
      Buffer.from(data, 'base64'),
      publicKey,
      signature,
    );
  }
}
