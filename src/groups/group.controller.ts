import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';

import { BaseController, BaseQueryDTO, BaseMessageDTO } from '../common/base';
import { Access, AuthGuard, IsGroupAdmin, Level, Roles } from '../common/decorators';
import { AccessEnum, AdminRoleEnum, UserLevelEnum } from '../common/enums';
import { GroupService } from './group.service';
import { AuthUser } from '../auth/decorators';
import {
  RatingQueryDTO,
  TotalResponseDTO,
  WeekQueryDTO,
  BaseIdDTO,
  GroupTokenDTO,
  BaseGroupQueryDTO
} from '../common/DTO';
import { Person } from '../auth/models';
import {
  AllGroupsAdminResponseDTO,
  CreateGroupDTO,
  CreateGroupResponseDTO,
  GetGroupResponseDTO,
  GroupResponseDTO,
  GroupRatingResponseDTO,
  UpdateGroupDTO,
  CreateGroupByAdminDTO,
  UpdateGroupByAdminDTO
} from './DTO';

@AuthGuard()
@ApiBearerAuth()
@Controller('groups')
@ApiTags('Groups')
export class GroupController extends BaseController {
  constructor(private readonly groupService: GroupService) {
    super();
  }

  @ApiCreatedResponse({ description: 'Returns created group', type: CreateGroupResponseDTO, })
  @Access(AccessEnum.USER)
  @Level(UserLevelEnum.LEADER_I)
  @Post()
  create(@AuthUser() user: Person, @Body() body: CreateGroupDTO): Promise<CreateGroupResponseDTO> {
    return this.groupService.create(user, body);
  }

  @ApiCreatedResponse({ description: 'Returns created group', type: CreateGroupResponseDTO, })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, ])
  @Access(AccessEnum.ADMIN)
  @Post('admin')
  createByAdmin(@AuthUser() user: Person, @Body() body: CreateGroupByAdminDTO): Promise<CreateGroupResponseDTO> {
    return this.groupService.createByAdmin(body);
  }

  @ApiOkResponse({ description: 'Returns list of groups in admin panel', type: [ AllGroupsAdminResponseDTO, ], })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, ])
  @Access(AccessEnum.ADMIN)
  @Get('all/admin')
  readAllForAdmin(): Promise<Array<AllGroupsAdminResponseDTO>> {
    return this.groupService.readAllForAdmin();
  }

  @ApiOkResponse({ description: 'Returns group rating', type: [ GroupRatingResponseDTO, ], })
  @Access(AccessEnum.USER)
  @Get('rating/top')
  readRating(@AuthUser() user: Person, @Query() query: WeekQueryDTO): Promise<Array<GroupRatingResponseDTO>> {
    return this.groupService.readGroupRating(user.groupId, query.week);
  }

  @ApiOkResponse({ description: 'Returns users\' rating', type: [ GroupRatingResponseDTO, ], })
  @Access(AccessEnum.USER)
  @Get('rating/all')
  readRatingAll(@Query() query: RatingQueryDTO): Promise<Array<GroupRatingResponseDTO>> {
    return this.groupService.readRatingAll(query);
  }

  @ApiOkResponse({ description: 'Returns group by id', type: GroupResponseDTO, })
  @Access(AccessEnum.USER)
  @Get()
  read(@Query() query: BaseQueryDTO): Promise<GroupResponseDTO> {
    return this.groupService.read(query.id);
  }

  @ApiOkResponse({ description: 'Returns group by id', type: GroupResponseDTO, })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, ])
  @Access(AccessEnum.ADMIN)
  @Get()
  readByAdmin(@Query() query: BaseQueryDTO): Promise<GroupResponseDTO> {
    return this.groupService.readByAdmin(query.id);
  }

  @ApiOkResponse({ description: 'Returns group id by token', type: BaseIdDTO, })
  @Access(AccessEnum.USER)
  @Get('by-token')
  readByToken(@Query() query: GroupTokenDTO): Promise<BaseIdDTO> {
    return this.groupService.readByToken(query.token);
  }

  @ApiOkResponse({ description: 'Returns updated group', type: GetGroupResponseDTO, })
  @IsGroupAdmin()
  @Access(AccessEnum.USER)
  @Put()
  update(@AuthUser() person: Person, @Body() body: UpdateGroupDTO): Promise<GetGroupResponseDTO> {
    return this.groupService.update(person, body);
  }

  @ApiOkResponse({ description: 'Returns updated group', type: GetGroupResponseDTO, })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, ])
  @Access(AccessEnum.ADMIN)
  @Put('admin')
  updateByAdmin(@Body() body: UpdateGroupByAdminDTO): Promise<GetGroupResponseDTO> {
    return this.groupService.updateByAdmin(body);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns number of created group for today', type: TotalResponseDTO, })
  @Access(AccessEnum.ADMIN)
  @Get('statistics/number-created-group/today')
  readNumberOfCreatedGroupToday(): Promise<TotalResponseDTO> {
    return this.groupService.getNumberCreatedGroupToday();
  }

  @ApiOkResponse({ description: 'Returns updated group', type: GetGroupResponseDTO, })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, ])
  @Access(AccessEnum.ADMIN)
  @Put('block/admin')
  blockGroup(@AuthUser() user: Person, @Query() query: BaseGroupQueryDTO): Promise<BaseMessageDTO> {
    return this.groupService.blockGroup(query.groupId);
  }
}
