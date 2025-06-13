import { Min, ValidationOptions } from 'class-validator';

export function IsExtendedNatural(validationOptions?: ValidationOptions): PropertyDecorator {
  const extendedNaturalSetStart = 0;
  return Min(extendedNaturalSetStart, validationOptions);
}
