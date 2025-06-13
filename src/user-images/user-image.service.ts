import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { In } from 'typeorm';

import { UserService } from '../users/user.service';
import { ImageService } from '../images/image.service';
import { UserImageRepository } from './user-image.repository';
import type { BaseMessageDTO } from '../common/base';
import type { UserImageResponseDTO, CreateUserImageResponseDTO } from './DTO';
import { StorageContainerEnum } from '../common/enums';
import type { UserImage } from './user-image.entity';
import { complaintsThreshold } from '../common/constants';

@Injectable()
export class UserImageService {
  constructor(
    private readonly userImageRepository: UserImageRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => ImageService))
    private readonly imageService: ImageService
  ) { }

  async create(userId: number, imageId: number): Promise<CreateUserImageResponseDTO> {
    const user = await this.userService.readById(userId);
    const image = await this.imageService.readImageById(imageId, StorageContainerEnum.USER_IMAGES);
    const recordIsExists = !!await this.userImageRepository.readEntity({ where: { user, image, }, });
    if (recordIsExists) {
      throw new BadRequestException('The wall image already exists');
    }
    return this.userImageRepository.createEntity({ user, image, });
  }

  async readAll(userId: number): Promise<Array<UserImageResponseDTO>> {
    const user = await this.userService.readById(userId);
    const userImages = await this.userImageRepository.readAllEntities({
      relations: [ 'image', 'complaints', ], where: { user, },
    });
    return userImages.map(userImage => ({
      ...userImage,
      isHidden: userImage.complaints.length > complaintsThreshold,
    }));
  }

  async readManyByIds(imageIds: Array<number>): Promise<Array<UserImage>> {
    const userImages = await this.userImageRepository.readAllEntities({ where: { id: In(imageIds), }, });
    const ids = userImages.map(image => image.id);
    const isExist = imageIds.every(imageId => ids.includes(imageId));
    if (!isExist) {
      throw new NotFoundException('The entities was not found');
    }
    return userImages;
  }

  async delete(userId: number, ids: Array<number>): Promise<BaseMessageDTO> {
    const user = await this.userService.readById(userId);
    const images = await this.userImageRepository.readAllEntities({ where: { user, id: In(ids), }, });
    const imageIds = images.map(image => image.id);
    const isExist = ids.length === images.length && ids.every(id => imageIds.includes(id));
    if (!isExist) {
      throw new NotFoundException('The entity with this id was not found');
    }
    await this.userImageRepository.softDeleteManyEntities(ids);
    return { message: 'The entity was successfully deleted', };
  }

  async deleteManyForAdmin(userImages: Array<UserImage>): Promise<void> {
    const ids = userImages.map(item => item.id);
    await this.userImageRepository.softDeleteManyEntities(ids);
  }
}
