import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

import { country } from '../../../data';
import { IIsGlossaryIdFunction, ISubGlossaryData } from './interface';
import { IIdentifiable } from '../interface';
let defaultValue = '';

const glossary: Record<string, ISubGlossaryData> = {
  'state': {
    glossaryData: country,
    firstLevelId: 'countryId',
    subGlossaryProperty: 'states',
  },
};

function getGlossary(key: string): ISubGlossaryData {
  return glossary[key];
}

function checkValue(glossary: ISubGlossaryData, value: number, firstLevelValue: unknown, relatedValue: unknown): boolean {
  if (!firstLevelValue) {
    if (glossary['firstLevelId'] === 'countryId') {
      firstLevelValue = relatedValue;
    } else {
      return false;
    }
  }
  const firstLevelGlossary = glossary.glossaryData.find(o => o.id === firstLevelValue);
  if (!firstLevelGlossary) {
    return false;
  }
  const secondLevelGlossary = firstLevelGlossary[glossary.subGlossaryProperty] as Array<IIdentifiable>;
  return secondLevelGlossary.some(o => o.id === value);
}

export function IsSubGlossaryId<T>(property: keyof T, validationOptions?: ValidationOptions): IIsGlossaryIdFunction {
  return function(object: Record<string, unknown>, propertyName: string): void {
    registerDecorator({
      name: 'IsSubGlossaryId',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [ property, ],
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments): boolean {
          if (value === null) {
            return true;
          }
          const [ relatedPropertyName, ] = args.constraints;
          const glossary = getGlossary(validationOptions.context);
          const relatedValue = (args.object as never)[relatedPropertyName] ?? 1;
          const brazil = relatedPropertyName === 'countryId' && relatedValue === 1;
          defaultValue = !brazil ? `invalid value ${args.property}` :
            `The ${args.property} should be a glossary id`;
          return brazil && typeof value === 'number' && checkValue(glossary, value, (args.object as Record<string, unknown>)[glossary.firstLevelId], relatedValue);
        },
        defaultMessage(): string {
          return defaultValue;
        },
      },
    });
  };
}
