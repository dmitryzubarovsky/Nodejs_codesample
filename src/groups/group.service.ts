import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Between } from 'typeorm';
import { DateTime } from 'luxon';

import { ImageService } from '../images/image.service';
import { GroupRepository } from './group.repository';
import { UserService } from '../users/user.service';
import {
  DateUnitEnum,
  GroupsUsersEnum,
  GroupsUsersRoleEnum,
  StorageContainerEnum,
  UserLevelEnum,
  EmailTypeEnum,
  WeekEnum
} from '../common/enums';
import { getCurrentDateRange, getLastDateRange } from '../common/utilities';
import type { Group } from './group.entity';
import type {
  AllGroupsAdminResponseDTO,
  CreateGroupByAdminDTO,
  CreateGroupDTO,
  CreateGroupResponseDTO,
  GetGroupResponseDTO,
  GroupRatingResponseDTO,
  GroupResponseDTO,
  UpdateGroupByAdminDTO,
  UpdateGroupDTO
} from './DTO';
import type { BaseIdDTO, RatingQueryDTO, TotalResponseDTO } from '../common/DTO';
import { GroupUsersService } from '../group-users/group-users.service';
import { SaleService } from '../sales/sale.service';
import type { Person } from '../auth/models';
import { ratingLimit } from '../common/constants';
import { CryptographerServices } from '../common/services';
import { BaseMessageDTO } from '../common/base';
import { MailService } from '../mail/mail.service';

@Injectable()
export class GroupService {
  constructor(
    private readonly groupRepository: GroupRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => ImageService))
    private readonly imageService: ImageService,
    @Inject(forwardRef(() => GroupUsersService))
    private readonly groupUsersService: GroupUsersService,
    @Inject(forwardRef(() => SaleService))
    private readonly saleService: SaleService,
    private readonly cryptographerService: CryptographerServices,
    @Inject(forwardRef(() => MailService))
    private readonly mailService: MailService
  ) {}

  create(person: Person, body: CreateGroupDTO): Promise<CreateGroupResponseDTO> {
    if (person.adminGroupId) {
      throw new BadRequestException('User already belongs to group');
    }
    return this.createGroup({ ...body, userId: person.userId, });
  }

  async createByAdmin(body: CreateGroupByAdminDTO): Promise<CreateGroupResponseDTO> {
    const userLevel = await this.saleService.getOneUserLevel(body.userId);
    const groupUsers = await this.groupUsersService.getGroupUsersByUserId(body.userId);
    if (groupUsers.adminGroup) {
      throw new BadRequestException('This user is already the owner of the group');
    }

    if (userLevel.level < UserLevelEnum.LEADER_I) {
      throw new BadRequestException(`Only users with ${UserLevelEnum[UserLevelEnum.LEADER_I]} level been able to own group`);
    }
    return this.createGroup(body);
  }

  readAllForAdmin(): Promise<Array<AllGroupsAdminResponseDTO>> {
    return this.groupRepository.readAllGroupsForAdmin();
  }

  async readGroupRating(groupId: number, week: WeekEnum): Promise<Array<GroupRatingResponseDTO>> {
    const dataRange = week === WeekEnum.CURRENT ? getCurrentDateRange(DateUnitEnum.WEEK) : getLastDateRange(DateUnitEnum.WEEK);
    const groupRatingFromDB = await this.groupRepository
      .readRatingTop(dataRange, ratingLimit, groupId);
    return this.saleService.addUserLevel('creatorId', groupRatingFromDB);
  }

  async readRatingAll(query: RatingQueryDTO): Promise<Array<GroupRatingResponseDTO>> {
    if (query.salesFrom > query.salesTo) {
      throw new BadRequestException('salesTo must be greater than salesFrom');
    }
    const ratingFromDB = await this.groupRepository.readRatingAll(query);
    return this.saleService.addUserLevel('creatorId', ratingFromDB);
  }

  async read(id: number): Promise<GroupResponseDTO> {
    const group = await this.groupRepository.read(id);
    if (!group) {
      throw new NotFoundException('The entity with this id was not found');
    }
    const creator = await this.groupUsersService.getGroupOwnerById(id);
    const rating = await this.readGroupRating(group.id, WeekEnum.CURRENT);
    const ratingNumber = rating.find(item => item.id === group.id)?.ratingNumber ?? null;
    return { ...group, ratingNumber, creator, };
  }

  async readByAdmin(id: number): Promise<GroupResponseDTO> {
    const group = await this.groupRepository.read(id);
    if (!group) {
      throw new NotFoundException('The entity with this id was not found');
    }
    const creator = await this.groupUsersService.getGroupOwnerById(id);
    const rating = await this.readGroupRating(group.id, WeekEnum.CURRENT);
    const ratingNumber = rating.find(item => item.id === group.id)?.ratingNumber ?? null;
    return { ...group, ratingNumber, creator, };
  }

  async readByToken(token: string): Promise<BaseIdDTO> {
    const { groupId, } = await this.cryptographerService.decrypt(token, 'groupId', [ 'groupId', ]);
    return { id: groupId, };
  }

  async update(person: Person, body: UpdateGroupDTO): Promise<GetGroupResponseDTO> {
    const avatar = body.avatarImageId ? await this.imageService.readImageById(body.avatarImageId, StorageContainerEnum.GROUP_AVATAR) : null;
    return this.groupRepository.updateEntity(person.adminGroupId, { avatar, name: body.name, });
  }

  async updateByAdmin(body: UpdateGroupByAdminDTO): Promise<GetGroupResponseDTO> {
    const group = await this.getGroupById(body.groupId);
    const avatar = body.avatarImageId ? await this.imageService.readImageById(body.avatarImageId, StorageContainerEnum.GROUP_AVATAR) : null;
    return this.groupRepository.updateEntity(group.id, { avatar, name: body.name, });
  }

  async getNumberCreatedGroupToday(): Promise<TotalResponseDTO> {
    const day = getCurrentDateRange(DateUnitEnum.DAY);
    const total = await this.groupRepository.count({ where: { createdAt: Between(day.startDate, day.endDate), }, });
    return { total, };
  }

  async blockGroup(groupId: number): Promise<BaseMessageDTO> {
    const group = await this.getGroupById(groupId);
    if (group.blockedAt) {
      throw new BadRequestException('This group is already blocked');
    }
    const groupOwner = await this.groupUsersService.getGroupCreator(groupId);
    await this.groupRepository.update(groupId, { blockedAt: DateTime.now(), });
    await this. mailService.sendEmail({
      handlebars: [ groupOwner.id, group.id, ],
      type: EmailTypeEnum.GROUP_BLOCKED,
      email: groupOwner.email,
    });
    return { message: 'Group was successfully blocked', };
  }

  async getGroupById(id: number, relations?: Array<string>): Promise<Group> {
    const group = await this.groupRepository.readEntityById(id, { relations, });
    if (!group) {
      throw new NotFoundException('Group with this id was not found');
    }
    return group;
  }

  deleteAvatar(group: Group): Promise<Group> {
    group.avatar = null;
    return this.groupRepository.save(group);
  }

  private async createGroup(body: CreateGroupByAdminDTO): Promise<CreateGroupResponseDTO> {
    const user = await this.userService.readById(body.userId);
    const avatar = body.avatarImageId ? await this.imageService.readImageById(body.avatarImageId, StorageContainerEnum.GROUP_AVATAR) : null;
    const createdGroup = await this.groupRepository.createEntity({ name: body.name, avatar, });
    await this.groupUsersService.createGroupUsers(user, createdGroup, GroupsUsersRoleEnum.ADMIN, GroupsUsersEnum.ACCEPTED);
    return createdGroup;
  }
}
