import { IIdentifiable } from '../interface';
import { CountryGlossaryResponseDTO, State } from '../../glossaries/DTO';
import { country } from '../../../data';

export function getCountryValue(id: number): CountryGlossaryResponseDTO {
  return country.find((c: { id: number; }) => c.id === id);
}

export function getStateValue(id: number): State {
  const [ state, ] = country.map((el: { states: Array<State> }) => {
    return el.states.find((l: { id: number; }) => l.id === id);
  });
  return state;
}

export function getGlossaryValue<T extends IIdentifiable>(list: Array<T>, id: number): T {
  return list.find(l => l.id === id);
}
