import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { isValidPhoneNumber } from 'libphonenumber-js';

export function IsValidPhoneNumber(validationOptions?: ValidationOptions) {
  return function(object: unknown, propertyName: string): void {
    registerDecorator({
      name: 'IsValidPhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          return typeof value === 'string' && isValidPhoneNumber(value);
        },
        defaultMessage(validationArguments?: ValidationArguments): string {
          return `The ${validationArguments.property} should be a valid phone number`;
        },
      },
    });
  };
}
