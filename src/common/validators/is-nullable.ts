import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, ValidateIf, ValidationOptions } from 'class-validator';

export function IsNullable(validationOptions?: ValidationOptions): PropertyDecorator {
  return applyDecorators(
    ValidateIf((_o, value) => value !== null, validationOptions),
    IsNotEmpty()
  );
}
