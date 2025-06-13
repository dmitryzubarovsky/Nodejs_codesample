import {
  Injectable,
  PipeTransform,
  UnsupportedMediaTypeException
} from '@nestjs/common';
import { mimetypeExtensions } from '../constants';
import fileType from 'file-type';
import { mustBeNotEmpty } from '../validators';

@Injectable()
export class ParseFilePipe implements PipeTransform {
  constructor(private readonly mimetypes: Array<string>) {}

  async transform(
    file: Express.Multer.File
  ): Promise<Express.Multer.File> {
    mustBeNotEmpty(file, 'file');
    const typeFromBuffer = await fileType.fromBuffer(file.buffer);
    if (
      this.mimetypes.every(
        (mimetype) =>
          file.mimetype !== mimetype ||
          mimetypeExtensions[mimetype].every(
            (extension: string) => !file.originalname.endsWith(extension)
          ) ||
          !file.originalname.endsWith(typeFromBuffer.ext) ||
          file.mimetype !== typeFromBuffer.mime
      )
    ) {
      throw new UnsupportedMediaTypeException(
        `File type is not matching: ${this.mimetypes.join(', ')}`
      );
    }

    return file;
  }
}
