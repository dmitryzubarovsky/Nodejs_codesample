import {
  BadGatewayException,
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common';

import { GroupUsersRepository } from './group-users.repository';
import { EmailTypeEnum, GroupsUsersEnum, GroupsUsersRoleEnum } from '../common/enums';
import type { Person } from '../auth/models';
import type {
  GetMemberStatusDTO,
  GetMemberStatusResponseDTO,
  GroupCreatorResponseDTO,
  GroupMemberRatingResponseDTO,
  GroupMembersResponseDTO,
  ReadGroupMembersForUserDTO,
  StatusResponseDTO,
  GroupMemberDTO,
  AddGroupMemberResponseDTO
} from './DTO';
import type { BaseMessageDTO } from '../common/base';
import { GroupService } from '../groups/group.service';
import { GroupUsers } from './group-users.entity';
import type { User } from '../users/user.entity';
import { UserService } from '../users/user.service';
import { MailService } from '../mail/mail.service';
import { SaleService } from '../sales/sale.service';
import type { Group } from '../groups/group.entity';
import { AppConfigService, CryptographerServices } from '../common/services';
import type { LinkResponseDTO } from '../users/DTO';
import { CONFIG_PROVIDER_TOKEN } from '../common/services/types';
import { MailTokenService } from '../mail-tokens/mail-token.service';
import { UserRating } from 'src/common/types/user-rating.type';
import { UsersByUserId } from './common/types';

@Injectable()
export class GroupUsersService {
  constructor(
    @Inject(CONFIG_PROVIDER_TOKEN)
    private readonly config: AppConfigService,
    @Inject(forwardRef(() => CryptographerServices))
    private readonly cryptographerServices: CryptographerServices,
    private readonly groupUsersRepository: GroupUsersRepository,
    @Inject(forwardRef(() => GroupService))
    private readonly groupService: GroupService,
    @Inject(forwardRef(() => SaleService))
    private readonly saleService: SaleService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => MailTokenService))
    private readonly mailTokenService: MailTokenService,
    @Inject(forwardRef(() => MailService))
    private readonly mailService: MailService
  ) { }

  async readMembersRatingForAdmin(groupId: number, userId: number): Promise<Array<GroupMembersResponseDTO>> {
    const ratingFromDB = await this.groupUsersRepository.getMembersRating(groupId, userId);
    return this.saleService.addUserLevel<UserRating>('id', ratingFromDB);
  }

  async readMembersRatingForUser(person: Person, query: ReadGroupMembersForUserDTO): Promise<Array<GroupMembersResponseDTO>> {
    const ratingFromDB = await this.groupUsersRepository.getGroupMembers(person.adminGroupId, query);
    return this.saleService.addUserLevel<UserRating>('id', ratingFromDB);
  }

  async readMembersStatus(person: Person, query: GetMemberStatusDTO): Promise<Array<GetMemberStatusResponseDTO>> {
    const { search, ...memberStatuses } = query;
    const statuses = this.getMemberStatuses(memberStatuses);
    const membersWithStatuses = await this.groupUsersRepository
      .readMembersStatus(person.adminGroupId, search, statuses);
    return this.saleService.addUserLevel('id', membersWithStatuses);
  }

  async readRatingForUser(user: Person, groupId: number): Promise<Array<GroupMemberRatingResponseDTO>> {
    await this.groupService.getGroupById(groupId);
    const ratingFromDB = await this.groupUsersRepository.getMembersRating(groupId, user.userId);
    return this.saleService.addUserLevel<UserRating>('id', ratingFromDB);
  }

  async readRatingForAdmin(groupId: number): Promise<Array<GroupMemberRatingResponseDTO>> {
    await this.groupService.getGroupById(groupId);
    const ratingFromDB = await this.groupUsersRepository.getMembersRating(groupId);
    return this.saleService.addUserLevel<UserRating>('id', ratingFromDB);
  }

  async inviteToGroup(person: Person, userId: number): Promise<BaseMessageDTO> {
    if (person.userId === userId) {
      throw new BadRequestException('You can\'t invite yourself');
    }
    const group = await this.groupService.getGroupById(person.adminGroupId);
    const invitedUser = await this.userService.readById(userId);
    const isNotAvailable = !! await this.groupUsersRepository.readEntity({
      where: [
        {
          user: invitedUser,
          status: GroupsUsersEnum.ACCEPTED,
        },
        {
          user: invitedUser,
          status: GroupsUsersEnum.SENT,
          group,
        },
      ],
    });
    if (isNotAvailable || invitedUser.confirmedAt == null) {
      throw new BadRequestException('User cannot be invited');
    }
    let groupUserInvitation;
    try {
      groupUserInvitation = await this.groupUsersRepository.createEntity({
        user: invitedUser,
        group,
        role: GroupsUsersRoleEnum.USER,
        status: GroupsUsersEnum.SENT,
      });
      await this.mailService.sendEmail({
        handlebars: [ userId, group.id, ],
        type: EmailTypeEnum.INVITE,
        email: invitedUser.email,
      });
    } catch (e) {
      await this.groupUsersRepository.hardDeleteEntity(groupUserInvitation.id);
      throw new BadGatewayException('Email sending service is temporary unavailable');
    }
    return { message: 'Email was sent successfully.', };
  }

  async isUserInvited(person: Person, groupId: number): Promise<StatusResponseDTO> {
    let status = false;
    if (!person?.groupId && !person?.adminGroupId) {
      const user = await this.userService.readById(person.userId);
      const group = await this.groupService.read(groupId);
      status = !! await this.groupUsersRepository.readEntity({
        where: {
          user,
          group,
          status: GroupsUsersEnum.SENT,
        },
      });
    }
    return { status, };
  }

  async ungroup(person: Person, userId: number): Promise<BaseMessageDTO> {
    if (userId === person.userId) {
      throw new BadRequestException('Users must not ungroup themselves');
    }
    const ungroupUser = await this.userService.readById(userId);

    const groupUsers = await this.getGroupUsersByUserId(ungroupUser.id);
    if (groupUsers?.groupMember?.group.id !== person.adminGroupId) {
      throw new BadRequestException('You can\'t ungroup users from a group in which you\'re not an admin');
    }

    await this.groupUsersRepository.softDelete({ user: ungroupUser, status: GroupsUsersEnum.ACCEPTED, });
    return { message: 'User has been successfully ungrouped', };
  }

  async ungroupByAdmin(body: GroupMemberDTO): Promise<BaseMessageDTO> {
    const user = await this.userService.readById(body.userId);
    const group = await this.groupService.getGroupById(body.groupId);
    const groupUsers = await this.getGroupUsersByUserId(body.userId);
    if (groupUsers.adminGroup) {
      throw new ForbiddenException('The group admin must not be ungrouped');
    }
    if (!groupUsers?.groupMember || groupUsers.groupMember.group.id !== body.groupId) {
      throw new BadRequestException('User is not a member of this group');
    }
    await this.groupUsersRepository.softDelete({ user, group, status: GroupsUsersEnum.ACCEPTED, role: GroupsUsersRoleEnum.USER, });
    await this.mailService.sendEmail({
      handlebars: [ user.id, group.id, ],
      type: EmailTypeEnum.UNGROUP,
      email: user.email,
    });

    return { message: 'User has been successfully ungrouped', };
  }

  async leaveGroup(person: Person): Promise<BaseMessageDTO> {
    if (!person.groupId || person.adminGroupId) {
      throw new NotFoundException('User does not participate in any group');
    }
    const user = await this.userService.readById(person.userId);
    await this.groupUsersRepository.softDelete({ user, status: GroupsUsersEnum.ACCEPTED, });
    return { message: 'User has successfully left the group', };
  }

  async acceptOrReject(person: Person, groupId: number, status: GroupsUsersEnum): Promise<BaseMessageDTO> {
    if (!!person?.groupId || !!person?.adminGroupId) {
      throw new ForbiddenException('User already participates a group');
    }
    const user = await this.userService.readById(person.userId);
    const group = await this.groupService.read(groupId);
    const groupUser = await this.groupUsersRepository.readEntity({
      where: {
        user,
        group,
        status: GroupsUsersEnum.SENT,
      },
    });
    if (!groupUser) {
      throw new NotFoundException('User is not invited to this group');
    }
    await this.groupUsersRepository.updateEntity(groupUser.id, { status, });
    if (status == GroupsUsersEnum.ACCEPTED) {
      await this.rejectAllInvitations(user.id);
    }
    return { message: 'Status was successfully updated', };
  }

  createGroupUsers(user: User, group: Group, role: GroupsUsersRoleEnum, status: GroupsUsersEnum): Promise<GroupUsers> {
    return this.groupUsersRepository.createEntity({ user, group, role, status, });
  }

  async getGroupOwnerById(groupId: number): Promise<GroupCreatorResponseDTO> {
    const groupOwner = await this.getGroupCreator(groupId);
    const levelData = await this.saleService.getOneUserLevel(groupOwner.id);
    delete levelData.salesToNextLevel;
    return {
      id: groupOwner.id,
      createdAt: groupOwner.createdAt,
      updatedAt: groupOwner.updatedAt,
      deletedAt: groupOwner.deletedAt,
      nickname: groupOwner.nickname,
      avatarImageId: groupOwner.avatarImageId,
      countryId: groupOwner.countryId,
      stateId: groupOwner.stateId,
      city: groupOwner.city,
      ...levelData,
    };
  }

  getInvitationLink(groupId: number): LinkResponseDTO {
    const linkKey = this.cryptographerServices.encrypt(
      JSON.stringify({ groupId, })
    );
    const link = this.config.frontendUrlConfig.groupInvitationUrl + linkKey;
    return { link, };
  }

  async joinGroupByLink(person: Person, code: string): Promise<BaseMessageDTO> {
    if (person.groupId || person.adminGroupId) {
      throw new ForbiddenException('User already participates a group');
    }
    const { groupId, } = await this.cryptographerServices.decrypt(code, 'groupId', [ 'groupId', ]);
    const user = await this.userService.readById(person.userId);
    const group = await this.groupService.getGroupById(groupId);
    await this.createGroupUsers(user, group, GroupsUsersRoleEnum.USER, GroupsUsersEnum.ACCEPTED);
    return { message: 'The user has joined group', };
  }

  async addMember(body: GroupMemberDTO): Promise<AddGroupMemberResponseDTO> {
    const user = await this.userService.readById(body.userId);
    const group = await this.groupService.getGroupById(body.groupId);
    const groupUsers = await this.getGroupUsersByUserId(body.userId);
    if (groupUsers.groupMember) {
      throw new BadRequestException('This user already has a group');
    }
    const createdMember = await this.createGroupUsers(user, group, GroupsUsersRoleEnum.USER, GroupsUsersEnum.ACCEPTED);
    await this.mailService.sendEmail({
      handlebars: [ user.id, group.id, ],
      type: EmailTypeEnum.ADD_GROUP_MEMBER,
      email: user.email,
    });

    return createdMember;
  }

  async getGroupCreatorByMemberId(user: User): Promise<User> {
    const groupUser = await this.groupUsersRepository.readEntity({
      where: {
        user,
        role: GroupsUsersRoleEnum.USER,
        status: GroupsUsersEnum.ACCEPTED,
      },
      relations: [ 'group', ],
    });
    let creator = null;
    if (groupUser) {
      creator = await this.getGroupCreator(groupUser.group?.id);
    }
    return creator;
  }

  async getGroupUsersByUserId(userId: number): Promise<UsersByUserId> {
    const result: UsersByUserId = { groupMember: null, adminGroup: null, };
    const user = await this.userService.readById(userId);
    const groupUsers = await this.groupUsersRepository.readAllEntities({
      where: { user, status: GroupsUsersEnum.ACCEPTED, },
      relations: [ 'group', ],
    });
    groupUsers?.forEach(groupUser => {
      switch (groupUser.role) {
      case GroupsUsersRoleEnum.USER:
        result.groupMember = groupUser;
        break;
      case GroupsUsersRoleEnum.ADMIN:
        result.adminGroup = groupUser;
        break;
      }
    });
    return result;
  }

  async rejectAllInvitations(userId: number): Promise<void> {
    const user = await this.userService.readById(userId);
    await this.groupUsersRepository.update({
      user,
      status: GroupsUsersEnum.SENT,
    }, { status: GroupsUsersEnum.REJECTED, });
  }

  async getGroupCreator(groupId: number): Promise<User> {
    const groupUser = await this.groupUsersRepository.readEntity({
      where: {
        group: { id: groupId, },
        role: GroupsUsersRoleEnum.ADMIN,
      },
      relations: [ 'user', ],
    });
    if (!groupUser) {
      throw new BadGatewayException('GroupUser wasn\'t found');
    }
    return groupUser?.user;
  }

  private getMemberStatuses(statuses: Omit<GetMemberStatusDTO, 'search'>): Array<GroupsUsersEnum> {
    type MemberStatus = keyof Omit<GetMemberStatusDTO, 'search'>;
    const statusMap: Record<MemberStatus, GroupsUsersEnum> = {
      sentStatus: GroupsUsersEnum.SENT,
      rejectedStatus: GroupsUsersEnum.REJECTED,
      acceptedStatus: GroupsUsersEnum.ACCEPTED,
    };
    return Object.keys(statuses)
      .filter((status: MemberStatus) => statuses[status] === true)
      .map((status: MemberStatus) => statusMap[status]);
  }
}
