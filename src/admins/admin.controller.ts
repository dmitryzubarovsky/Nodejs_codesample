import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Patch, Post, Put, Query } from '@nestjs/common';

import {
  AdminResponseDTO, ChangePasswordForRootDTO,
  CreateAdminDTO,
  CreateAdminResponseDTO,
  ProfileResponseDTO,
  ReadNameResponseDTO
} from './DTO';
import { Access, AuthGuard, Roles } from '../common/decorators';
import { AccessEnum, AdminRoleEnum } from '../common/enums';
import { BaseController, BaseMessageDTO, BaseQueryDTO } from '../common/base';
import { AdminService } from './admin.service';
import { AuthUser } from '../auth/decorators';
import { Person } from '../auth/models';
import { ChangePasswordDTO, EmailDTO } from '../common/DTO';

@ApiBearerAuth()
@AuthGuard()
@Controller('admins')
@ApiTags('Admins')
export class AdminController extends BaseController {
  constructor(private readonly adminService: AdminService) {
    super();
  }

  @ApiCreatedResponse({ description: 'Returns created admin', type: CreateAdminResponseDTO, })
  @Roles([ AdminRoleEnum.ROOT, ])
  @Access(AccessEnum.ADMIN)
  @Post()
  create(@Body() body: CreateAdminDTO): Promise<CreateAdminResponseDTO> {
    return this.adminService.create(body);
  }

  @ApiOkResponse({ description: 'Returns list of all admins', type: [ AdminResponseDTO, ], })
  @Roles([ AdminRoleEnum.ROOT, ])
  @Access(AccessEnum.ADMIN)
  @Get('all')
  readAll(): Promise<Array<AdminResponseDTO>> {
    return this.adminService.readAll();
  }

  @ApiOkResponse({ description: 'Returns admin', type: AdminResponseDTO, })
  @Roles([ AdminRoleEnum.ROOT, ])
  @Access(AccessEnum.ADMIN)
  @Get()
  read(@Query() query: BaseQueryDTO): Promise<AdminResponseDTO> {
    return this.adminService.read(query.id);
  }

  @ApiOkResponse({ description: 'Updates admin', type: AdminResponseDTO, })
  @Roles([ AdminRoleEnum.ROOT, ])
  @Access(AccessEnum.ADMIN)
  @Put()
  update(@Query() query: BaseQueryDTO, @Body() body: CreateAdminDTO): Promise<AdminResponseDTO> {
    return this.adminService.update(query.id, body);
  }

  @ApiOkResponse({ description: 'Returns status of password changing', type: BaseMessageDTO, })
  @Access(AccessEnum.ADMIN)
  @Patch('change-password')
  changePassword(@AuthUser() admin: Person, @Body() body: ChangePasswordDTO): Promise<BaseMessageDTO> {
    return this.adminService.changePassword(admin, body);
  }

  @ApiOkResponse({ description: 'Returns admins profile', type: ProfileResponseDTO, })
  @Access(AccessEnum.ADMIN)
  @Get('profile')
  readProfile(@AuthUser() admin: Person): Promise<ProfileResponseDTO> {
    return this.adminService.readProfile(admin.adminId);
  }

  @ApiOkResponse({ description: 'Returns admins profile', type: ReadNameResponseDTO, })
  @Access(AccessEnum.ADMIN)
  @Get('name')
  readName(@AuthUser() admin: Person): Promise<ReadNameResponseDTO> {
    return this.adminService.readName(admin);
  }

  @ApiOkResponse({ description: 'Locks admin', type: BaseMessageDTO, })
  @Roles([ AdminRoleEnum.ROOT, ])
  @Access(AccessEnum.ADMIN)
  @Patch('lock')
  lock(@AuthUser() admin: Person, @Query() query: BaseQueryDTO): Promise<BaseMessageDTO> {
    return this.adminService.lock(query.id);
  }

  @ApiOkResponse({ description: 'Unlocks admin', type: BaseMessageDTO, })
  @Roles([ AdminRoleEnum.ROOT, ])
  @Access(AccessEnum.ADMIN)
  @Patch('unlock')
  unlock(@AuthUser() admin: Person, @Query() query: BaseQueryDTO): Promise<BaseMessageDTO> {
    return this.adminService.unlock(query.id);
  }

  @ApiOkResponse({ description: 'Returns status of change the email', type: BaseMessageDTO, })
  @Access(AccessEnum.ROOT)
  @Patch('change-email-for-root')
  changeEmailForRoot(@AuthUser() admin: Person, @Body() body: EmailDTO): Promise<BaseMessageDTO> {
    return this.adminService.changeEmail(admin, body.email);
  }

  @ApiOkResponse({ description: 'Returns status of password changing', type: BaseMessageDTO, })
  @Patch('change-password-for-root')
  changePasswordForRoot(@Body() body: ChangePasswordForRootDTO): Promise<BaseMessageDTO> {
    return this.adminService.changePasswordForRoot(body);
  }
}
