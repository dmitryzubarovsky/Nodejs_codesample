import country from './country.json';
import bank from './bank.json';

import { IIdentifiable } from '../src/common/interface';

function getGlossaries (): Record<string, Array<IIdentifiable>> {
  return { country, bank, };
}

export {
  country,
  bank,
  getGlossaries,
}
