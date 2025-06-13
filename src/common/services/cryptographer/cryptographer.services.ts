import { createCipheriv, randomBytes, createDecipheriv } from 'crypto';
import { BadRequestException, Inject } from '@nestjs/common';

import { algorithm } from '../../constants/cryptographer-algorithm';
import { CONFIG_PROVIDER_TOKEN } from '../types';
import { AppConfigService } from '../config/app-config.service';

export class CryptographerServices {
  constructor(
    @Inject(CONFIG_PROVIDER_TOKEN)
    private readonly configService: AppConfigService
  ) {}

  encrypt(encodeData: string): string {
    // Sets the length of the initialization vector in bytes.
    const bytesNumber = 8;
    // Creates initialization vector and uses it in a cryptographic algorithm as a starting state,
    // adds this to a cipher to hide patterns in the encrypted data.
    const iv = randomBytes(bytesNumber).toString('hex');
    // Gets the encryption key. It's length should be equal to 16 bytes.
    const key = this.configService.encryptionKey;
    // Creates the encryption code using the algorithm, encoding data and the initialization vector.
    const cipher = createCipheriv(algorithm, key, iv);
    // Updates the encoded data to the specified encoding format.
    let encrypted = cipher.update(encodeData, 'utf8', 'hex');
    // Gets encrypted value by using final() method.
    encrypted += cipher.final('hex');
    // Returns the encoded value and the initialization vector.
    return `${encrypted}:${iv}`;
  }

  decrypt<T>(codedData: string, key: string, responseKeyArray: Array<string>): T {
    try {
      const [ encryptedData, iv, ] = codedData.split(':');
      const decipher = createDecipheriv(algorithm, this.configService.encryptionKey, iv);
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8' );
      decrypted += decipher.final('utf8');
      const decryptedObject = JSON.parse(decrypted);
      responseKeyArray.map(key => {
        if (!Object.keys(decryptedObject).includes(key)) {
          throw new BadRequestException(`Wrong ${key}`);
        }
      });
      return decryptedObject;
    }
    catch {
      throw new BadRequestException(`Wrong ${key}`);
    }
  }
}
