import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import validator from 'validator';

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function(object: unknown, propertyName: string): void {
    registerDecorator({
      name: 'IsStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          return typeof value === 'string' && validator.isStrongPassword(value);
        },
        defaultMessage(validationArguments?: ValidationArguments): string {
          return `The ${validationArguments.property} should be a strong password`;
        },
      },
    });
  };
}
