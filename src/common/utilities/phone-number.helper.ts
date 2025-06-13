import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';
import { TransformFnParams } from 'class-transformer';

export function convertPhoneNumber(params: TransformFnParams): string {
  let normalizedNumber = params.value;
  if (typeof normalizedNumber === 'string' && isValidPhoneNumber(params.value)) {
    const parsedPhoneNumber = parsePhoneNumber(params.value, 'BR');
    normalizedNumber = parsedPhoneNumber.number.toString();
  }
  return normalizedNumber;
}
