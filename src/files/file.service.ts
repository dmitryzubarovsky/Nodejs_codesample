import { Injectable, NotFoundException } from '@nestjs/common';

import { IFile } from './file.interface';
import { FileRepository } from './file.repository';
import { File } from './file.entity';

@Injectable()
export class FileService {
  constructor(private readonly fileRepository: FileRepository) {}

  create(file: IFile): Promise<File> {
    return this.fileRepository.createEntity(file);
  }

  async readById(id: number | string): Promise<File> {
    const file = await this.fileRepository.readEntityById(id);
    if (!file) {
      throw new NotFoundException('The entity with this id was not found');
    }
    return file;
  }
}
