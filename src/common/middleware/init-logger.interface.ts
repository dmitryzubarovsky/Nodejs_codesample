import { Request } from 'express';

export interface IInitLogger extends Request {
  _parsedUrl?: {
    pathname: string
  }
}
