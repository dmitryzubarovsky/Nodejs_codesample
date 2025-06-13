import { Max, Min, ValidationOptions } from 'class-validator';
import { applyDecorators } from '@nestjs/common';

export function IsSafeInt(validationOptions?: ValidationOptions): PropertyDecorator {
  const maxPostgresInt = 2147483647;
  const minPostgresInt = -2147483648;
  return applyDecorators(
    Max(maxPostgresInt, validationOptions),
    Min(minPostgresInt, validationOptions)
  );
}
