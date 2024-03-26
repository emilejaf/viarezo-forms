import { Injectable } from '@nestjs/common';
import crypto from 'node:crypto';
import { promisify } from 'util';

@Injectable()
export class AsymetricService {
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

  public encrypt(data: string, publicKey: crypto.KeyLike): string {
    return crypto
      .publicEncrypt(publicKey, Buffer.from(data, 'utf-8'))
      .toString('base64');
  }

  public decrypt(data: string, privateKey: crypto.KeyLike): string {
    return crypto
      .privateDecrypt(privateKey, Buffer.from(data, 'base64'))
      .toString('utf8');
  }
}
