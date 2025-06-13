import { Request } from 'express';

import { Person } from '../models';

export interface IAuthRequest extends Request {
  user: Person;
}
