import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { In } from 'typeorm';

import { ImageRepository } from './image.repository';
import { FileService } from '../files/file.service';
import { Image } from './image.entity';
import { StorageContainerEnum } from '../common/enums';

@Injectable()
export class ImageService {
  constructor(
    private readonly imageRepository: ImageRepository,
    @Inject(forwardRef(() => FileService))
    private readonly fileService: FileService
  ) { }

  async create(fileId: number): Promise<Image> {
    const file = await this.fileService.readById(fileId);
    return this.imageRepository.createEntity({ file, });
  }

  async readImageById(id: number, containerName: StorageContainerEnum): Promise<Image> {
    const image = await this.imageRepository.readEntityById(id, { relations: [ 'file', ], });
    if (image?.file.containerName !== containerName) {
      throw new NotFoundException('The entity with this id was not found');
    }
    return image;
  }

  async getMany(ids: Array<number>): Promise<Array<Image>> {
    const images = await this.imageRepository.readAllEntities({ where: { id: In(ids), }, });
    const imageIds = images.map(image => image.id);
    const isExist = ids.every(id => imageIds.includes(id));
    if (isExist === false) {
      throw new NotFoundException('The entities with these ids don\'t exist');
    }
    return images;
  }
}
