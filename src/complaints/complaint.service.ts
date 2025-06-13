import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { ComplaintResponseDTO, CreateComplaintDTO } from './DTO';
import { ComplaintRepository } from './complaint.repository';
import { UserService } from '../users/user.service';
import { GroupService } from '../groups/group.service';
import { UserImageService } from '../user-images/user-image.service';
import { GroupImageService } from '../group-images/group-image.service';
import type { Complaint } from './complaint.entity';
import type { BaseMessageDTO } from '../common/base';
import { xor } from '../common/utilities';
import { complaintsThreshold } from '../common/constants';

@Injectable()
export class ComplaintService {
  constructor(
    private readonly complaintRepository: ComplaintRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => GroupService))
    private readonly groupService: GroupService,
    @Inject(forwardRef(() => UserImageService))
    private readonly userImageService: UserImageService,
    @Inject(forwardRef(() => GroupImageService))
    private readonly groupImageService: GroupImageService
  ) {}

  async create(body: CreateComplaintDTO): Promise<ComplaintResponseDTO> {
    this.validate(body);
    const { userId, groupId, groupImageIds, userImageIds, ...complaint } = body;
    const user = userId !== null ? await this.userService.readById(userId, [ 'complaints', ]) : null;
    if (user?.complaints.length >= complaintsThreshold) {
      await this.userService.deleteAvatar(user);
    }
    const group = groupId !== null ? await this.groupService.getGroupById(groupId, [ 'complaints', ]) : null;
    if (group?.complaints.length >= complaintsThreshold) {
      await this.groupService.deleteAvatar(group);
    }
    const userImages = userImageIds !== null ? await this.userImageService.readManyByIds(userImageIds) : null;
    const groupImages = groupImageIds !== null ? await this.groupImageService.readManyByIds(groupImageIds) : null;
    const entity = { user, group, userImages, groupImages, ...complaint, };
    const createdComplaint = await this.complaintRepository
      .createEntity(entity, [ 'user', 'group', 'userImages', 'groupImages', ]);
    return this.mapDataFromDB(createdComplaint);
  }

  async readAll(): Promise<Array<ComplaintResponseDTO>> {
    const complaints = await this.complaintRepository.readAllEntities({
      relations: [ 'user', 'group', 'userImages', 'groupImages', ],
    });
    return complaints.map(complaint => this.mapDataFromDB(complaint));
  }

  async approve(id: number): Promise<BaseMessageDTO> {
    const complaint = await this.complaintRepository
      .readEntityById(id, { relations: [ 'user', 'group', 'userImages', 'groupImages', ], });

    if (!complaint) {
      throw new NotFoundException('The entity with this id doesn\'t exist');
    }

    const { user, group, userImages, groupImages, } = complaint;

    if (user) {
      await this.userService.deleteAvatar(user);
    } else if (group) {
      await this.groupService.deleteAvatar(group);
    } else if (userImages) {
      await this.userImageService.deleteManyForAdmin(userImages);
    } else if (groupImages) {
      await this.groupImageService.deleteMany(groupImages);
    }
    await this.complaintRepository.softDeleteEntity(id);
    return { message: 'The complaint was successfully approved', };
  }

  async delete(id: number): Promise<BaseMessageDTO> {
    await this.complaintRepository.delete(id);
    return { message: 'The entity was successfully deleted', };
  }

  private mapDataFromDB(complaint: Complaint): ComplaintResponseDTO {
    const mappedUserImages = complaint.userImages.map(item => ({
      id: item.id,
      imageId: item.imageId,
    }));

    const mappedGroupImages = complaint.groupImages.map(item => ({
      id: item.id,
      imageId: item.imageId,
    }));

    const zero = 0;

    return {
      id: complaint.id,
      createdAt: complaint.createdAt,
      updatedAt: complaint.updatedAt,
      deletedAt: complaint.deletedAt,
      isIndecent: complaint.isIndecent,
      isRude: complaint.isRude,
      isSensitive: complaint.isSensitive,
      description: complaint.description,
      userId: complaint?.user?.id ?? null,
      userAvatarImageId: complaint?.user?.avatarImageId ?? null,
      groupId: complaint?.group?.id ?? null,
      groupAvatarImageId: complaint?.group?.avatarImageId,
      userImages: mappedUserImages.length !== zero ? mappedUserImages : null,
      groupImages: mappedGroupImages.length !== zero ? mappedGroupImages : null,
    };
  }

  private validate(body: CreateComplaintDTO): void {
    const isValid = xor(
      body.userId !== null,
      body.groupId !== null,
      body.userImageIds !== null,
      body.groupImageIds !== null
    );
    if (!isValid) {
      throw new BadRequestException('Only one field out of the userId, groupId, userImageIds, groupImageIds must be filled');
    }
  }
}
