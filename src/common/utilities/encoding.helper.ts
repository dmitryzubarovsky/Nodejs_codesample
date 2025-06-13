import { BadRequestException } from '@nestjs/common';

export function encodeBase64(value: string): string {
  return Buffer.from(value).toString('base64');
}

export function decodeBase64<T>(value: string, key: string): T {
  let decoded;
  try {
    decoded = JSON.parse(Buffer.from(value, 'base64').toString());
  } catch (e) {
    throw new BadRequestException(`Incorrect ${key}`);
  }

  return decoded;
}
