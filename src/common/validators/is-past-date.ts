import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import validator from 'validator';

export function IsPastDate(validationOptions?: ValidationOptions) {
  return function(object: unknown, propertyName: string): void {
    registerDecorator({
      name: 'IsPastDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          return typeof value === 'string' && validator.isBefore(value, new Date().toISOString());
        },
        defaultMessage(validationArguments?: ValidationArguments): string {
          return `The ${validationArguments.property} should be past`;
        },
      },
    });
  };
}
