import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

import { getGlossaries } from '../../../data';
import { IIdentifiable } from '../interface';
import { IIsGlossaryIdFunction } from './interface';

const glossary = getGlossaries();

function getGlossary(key: string): Array<IIdentifiable> {
  return glossary[key];
}

function checkValue(key: string, value: number): boolean {
  return getGlossary(key).some(o => o.id == value);
}

export function IsGlossaryId(validationOptions?: ValidationOptions): IIsGlossaryIdFunction {
  return function(object: Record<string, unknown>, propertyName: string): void {
    registerDecorator({
      name: 'IsGlossaryId',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          return typeof value === 'number' && checkValue(validationOptions.context, value);
        },
        defaultMessage(validationArguments?: ValidationArguments): string {
          let message = '';
          message = validationOptions.each ? `Each value in ${validationArguments.property} must be a glossary id` :
            `The ${validationArguments.property} should be a glossary id`;

          return message;
        },
      },
    });
  };
}
