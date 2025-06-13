import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { In } from 'typeorm';

import { GroupImageRepository } from './group-image.repository';
import { GroupService } from '../groups/group.service';
import { ImageService } from '../images/image.service';
import { UserService } from '../users/user.service';
import type { BaseMessageDTO } from '../common/base';
import { GroupImage } from './group-image.entity';
import type {
  CreateGroupImageDTO,
  GetGroupImageResponseDTO,
  CreateGroupImageResponseDTO
} from './DTO';
import { GroupUsersService } from '../group-users/group-users.service';
import { StorageContainerEnum } from '../common/enums';
import type { Person } from '../auth/models';
import { complaintsThreshold } from '../common/constants';

@Injectable()
export class GroupImageService {
  constructor(
    private readonly groupImageRepository: GroupImageRepository,
    @Inject(forwardRef(() => GroupService))
    private readonly groupService: GroupService,
    @Inject(forwardRef(() => ImageService))
    private readonly imageService: ImageService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => GroupUsersService))
    private readonly groupUsersService: GroupUsersService
  ) { }

  async create(person: Person, body: CreateGroupImageDTO): Promise<CreateGroupImageResponseDTO> {
    const image = await this.imageService.readImageById(body.imageId, StorageContainerEnum.GROUP_IMAGES);
    const group = await this.groupService.getGroupById(person.adminGroupId);
    return this.groupImageRepository.createEntity({ group, image, });
  }

  async readAll(groupId: number): Promise<Array<GetGroupImageResponseDTO>> {
    const group = await this.groupService.getGroupById(groupId);
    const groupImages = await this.groupImageRepository.readAllEntities({
      where: { group, }, relations: [ 'complaints', ],
    });
    return groupImages.map(
      ({ complaints, ...groupImage }) =>
        ({ isHidden: complaints.length >= complaintsThreshold, ...groupImage, }));
  }

  async readManyByIds(groupImageIds: Array<number>): Promise<Array<GroupImage>> {
    const groupImages = await this.groupImageRepository.readAllEntities({
      where: { id: In(groupImageIds), },
    });
    const ids = groupImages.map(image => image.id);
    const isExist = ids.every(id => groupImageIds.includes(id));
    if (!isExist) {
      throw new NotFoundException('The entities with this ids was not found');
    }
    return groupImages;
  }

  async delete(person: Person, ids: Array<number>): Promise<BaseMessageDTO> {
    const group = await this.groupService.getGroupById(person.adminGroupId);
    const images = await this.groupImageRepository.readAllEntities({ where: { group, id: In(ids), }, });
    const imageIds = images.map(image => image.id);
    const isExist = ids.length === images.length && ids.every(id => imageIds.includes(id));
    if (!isExist) {
      throw new NotFoundException('The entity with this id was not found');
    }
    await this.groupImageRepository.softDeleteManyEntities(ids);
    return { message: 'The entities have been successfully deleted', };
  }

  async deleteMany(groupImages: Array<GroupImage>): Promise<void> {
    const ids = groupImages.map(item => item.id);
    await this.groupImageRepository.softDeleteManyEntities(ids);
  }
}
