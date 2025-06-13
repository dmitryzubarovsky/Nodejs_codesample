import { compile } from 'handlebars';

import { KeyTemplate } from '../enums';
import { IMediaStorageKeyOptions } from './interface';

export function calculateKey(template: KeyTemplate, options: IMediaStorageKeyOptions): string {
  return compile(template)(options);
}
