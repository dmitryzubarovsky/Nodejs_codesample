import { Buffer } from 'buffer';

export type Upload = {
  fileName: string;
  contentType: string;
  buffer: Buffer;
};
