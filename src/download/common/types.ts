import { Readable } from 'stream';

export type ResponseFile = {
  contentType: string;
  fileName: string;
  stream: Readable;
};
