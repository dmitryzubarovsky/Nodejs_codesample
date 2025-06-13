import { hash, compare } from 'bcrypt';

import { PASSWORD_HASH_SALT } from '../constants';

export function generatePasswordHash(password: string): Promise<string> {
  return hash(password, PASSWORD_HASH_SALT);
}

export function compareHashPassword(password: string, hash: string): Promise<boolean> {
  return compare(password, hash);
}
