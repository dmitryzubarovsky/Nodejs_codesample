import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Patch, Post, Put, Query } from '@nestjs/common';

import { BaseController, BaseMessageDTO, BaseUserIdQueryDTO } from '../common/base';
import { GroupUsersService } from './group-users.service';
import { Access, AuthGuard, IsGroupAdmin, Roles } from '../common/decorators';
import {
  GroupMemberDTO,
  AddGroupMemberResponseDTO,
  GetMemberStatusDTO,
  GetMemberStatusResponseDTO,
  GroupMemberRatingResponseDTO,
  GroupMembersResponseDTO,
  ReadGroupMembersForUserDTO,
  StatusResponseDTO
} from './DTO';
import { AccessEnum, AdminRoleEnum, GroupsUsersEnum } from '../common/enums';
import { AuthUser } from '../auth/decorators';
import { Person } from '../auth/models';
import { BaseGroupQueryDTO, GroupTokenDTO } from '../common/DTO';
import { LinkResponseDTO } from '../users/DTO';
import {AuthGuard as AuthGuardPassport} from '@nestjs/passport/dist/auth.guard';
import {AccessGuard, LevelGuard, RoleGuard} from '../common/guards';

@UseGuards(AuthGuardPassport(strategyName), AccessGuard, RoleGuard, LevelGuard))
@Controller('groups-users')
@ApiTags('Groups Users')
export class GroupUsersController extends BaseController {
  constructor(private readonly groupUsersService: GroupUsersService) {
    super();
  }

  @ApiOkResponse({ description: 'Returns group\'s members', type: [ GroupMembersResponseDTO, ], })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, ])
  @Access(AccessEnum.ADMIN)
  @Get('group-members/admin')
  readGroupMembersForAdmin(@Query() query: BaseGroupQueryDTO, @AuthUser() user: Person): Promise<Array<GroupMembersResponseDTO>> {
    return this.groupUsersService.readMembersRatingForAdmin(query.groupId, user.userId);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns group\'s members', type: [ GroupMembersResponseDTO, ], })
  @Access(AccessEnum.USER)
  @Get('group-members/user')
  readGroupMembersForUser(@AuthUser() user: Person, @Query() query: ReadGroupMembersForUserDTO): Promise<Array<GroupMembersResponseDTO>> {
    return this.groupUsersService.readMembersRatingForUser(user, query);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns group\'s members', type: [ GetMemberStatusResponseDTO, ], })
  @Access(AccessEnum.USER)
  @Get('group-members/status')
  readGroupMembersStatus(@AuthUser() user: Person, @Query() query: GetMemberStatusDTO): Promise<Array<GetMemberStatusResponseDTO>> {
    return this.groupUsersService.readMembersStatus(user, query);
  }

  @ApiOkResponse({ description: 'Returns users\' group rating', type: [ GroupMemberRatingResponseDTO, ], })
  @Access(AccessEnum.USER)
  @Get('rating/top/user')
  readRatingForUser(@AuthUser() user: Person, @Query() query: BaseGroupQueryDTO): Promise<Array<GroupMemberRatingResponseDTO>> {
    return this.groupUsersService.readRatingForUser(user, query.groupId);
  }

  @ApiOkResponse({ description: 'Returns users\' group rating', type: [ GroupMemberRatingResponseDTO, ], })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, ])
  @Access(AccessEnum.ADMIN)
  @Get('rating/top/admin')
  readRatingForAdmin(@Query() query: BaseGroupQueryDTO): Promise<Array<GroupMemberRatingResponseDTO>> {
    return this.groupUsersService.readRatingForAdmin(query.groupId);
  }

  @ApiBearerAuth()
  @IsGroupAdmin()
  @ApiOkResponse({ description: 'Invites  user to a group', type: BaseMessageDTO, })
  @Access(AccessEnum.USER)
  @Patch('invite-to-group')
  inviteToGroup(@AuthUser() user: Person, @Query() query: BaseUserIdQueryDTO): Promise<BaseMessageDTO> {
    return this.groupUsersService.inviteToGroup(user, query.userId);
  }

  @ApiOkResponse({ description: 'Returns status of invitation the user to a group', type: StatusResponseDTO, })
  @Access(AccessEnum.USER)
  @Get('is-invited')
  isUserInvited(@AuthUser() user: Person, @Query() query: BaseGroupQueryDTO): Promise<StatusResponseDTO> {
    return this.groupUsersService.isUserInvited(user, query.groupId);
  }

  @ApiBearerAuth()
  @ApiOkResponse()
  @IsGroupAdmin()
  @Access(AccessEnum.USER)
  @Put('ungroup')
  ungroup(@AuthUser() user: Person, @Query() query: BaseUserIdQueryDTO): Promise<BaseMessageDTO> {
    return this.groupUsersService.ungroup(user, query.userId);
  }

  @ApiBearerAuth()
  @ApiOkResponse()
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, ])
  @Access(AccessEnum.ADMIN)
  @Put('ungroup/admin')
  ungroupByAdmin(@AuthUser() user: Person, @Body() body: GroupMemberDTO): Promise<BaseMessageDTO> {
    return this.groupUsersService.ungroupByAdmin(body);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Removes the user from the group', type: BaseMessageDTO, })
  @Access(AccessEnum.USER)
  @Delete('leave')
  leave(@AuthUser() user: Person): Promise<BaseMessageDTO> {
    return this.groupUsersService.leaveGroup(user);
  }

  @ApiOkResponse({ description: 'Accepts invitation to group', type: BaseMessageDTO, })
  @Access(AccessEnum.USER)
  @Patch('accept')
  accept(@AuthUser() person: Person, @Query() query: BaseGroupQueryDTO): Promise<BaseMessageDTO> {
    return this.groupUsersService.acceptOrReject(person, query.groupId, GroupsUsersEnum.ACCEPTED);
  }

  @ApiOkResponse({ description: 'Rejects invitation to group', type: BaseMessageDTO, })
  @Access(AccessEnum.USER)
  @Patch('reject')
  reject(@AuthUser() person: Person, @Query() query: BaseGroupQueryDTO): Promise<BaseMessageDTO> {
    return this.groupUsersService.acceptOrReject(person, query.groupId, GroupsUsersEnum.REJECTED);
  }

  @ApiBearerAuth()
  @IsGroupAdmin()
  @ApiOkResponse({ description: 'Returns invitation link', type: LinkResponseDTO, })
  @Access(AccessEnum.USER)
  @Get('invitation-link')
  getInvitationLink(@AuthUser() user: Person): LinkResponseDTO {
    return this.groupUsersService.getInvitationLink(user.adminGroupId);
  }

  @ApiOkResponse({ description: 'Joins the group by link', type: BaseMessageDTO, })
  @Access(AccessEnum.USER)
  @Patch('join-group-invitation-link')
  joinGroupByInvitationLink(@AuthUser() user: Person, @Body() body: GroupTokenDTO): Promise<BaseMessageDTO> {
    return this.groupUsersService.joinGroupByLink(user, body.token);
  }

  @ApiCreatedResponse({ description: 'Returns added user', type: AddGroupMemberResponseDTO, })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, ])
  @Access(AccessEnum.ADMIN)
  @Post('group-member/admin')
  addGroupMember(@AuthUser() person: Person, @Body() body: GroupMemberDTO): Promise<AddGroupMemberResponseDTO> {
    return this.groupUsersService.addMember(body);
  }
}
