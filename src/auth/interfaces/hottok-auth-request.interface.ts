import { Request } from 'express';
import { ParsedQs } from 'qs';

interface IHottokQuery extends ParsedQs {
  hottok: string;
}

export interface IHottokAuthRequest extends Request {
  query: IHottokQuery;
}
