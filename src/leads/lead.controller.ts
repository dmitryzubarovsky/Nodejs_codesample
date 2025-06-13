import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { BaseController, BaseMessageDTO, BaseQueryDTO } from '../common/base';
import { LeadService } from './lead.service';
import { CreateLeadDTO, LeadAllResponseDTO, LeadResponseDTO, ReadLeadAllDTO } from './DTO';
import { AuthUser } from '../auth/decorators';
import { Person } from '../auth/models';
import { Access, AuthGuard, Roles } from '../common/decorators';
import { AccessEnum, AdminRoleEnum } from '../common/enums';

@AuthGuard()
@ApiBearerAuth()
@Controller('leads')
@ApiTags('Leads')
export class LeadController extends BaseController {
  constructor(private readonly leadService: LeadService) {
    super();
  }

  @ApiCreatedResponse({ description: 'Returns created lead', type: LeadResponseDTO, })
  @Access(AccessEnum.USER)
  @Post()
  create(@AuthUser() user: Person, @Body() body: CreateLeadDTO): Promise<LeadResponseDTO> {
    return this.leadService.create(user, body);
  }

  @ApiOkResponse({ description: 'Returns user\'s leads', type: [ LeadAllResponseDTO, ], })
  @Access(AccessEnum.USER)
  @Get('all/user')
  readAllForUser(@AuthUser() user: Person, @Query() query: ReadLeadAllDTO): Promise<Array<LeadAllResponseDTO>> {
    return this.leadService.readAll(query, user);
  }

  @ApiOkResponse({ description: 'Returns all users\' leads', type: [ LeadAllResponseDTO, ], })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, ])
  @Access(AccessEnum.ADMIN)
  @Get('all/admin')
  readAllForAdmin(@Query() query: ReadLeadAllDTO): Promise<Array<LeadAllResponseDTO>> {
    return this.leadService.readAll(query);
  }

  @ApiOkResponse({ description: 'Updates lead', type: LeadResponseDTO, })
  @Access(AccessEnum.USER)
  @Put()
  update(@AuthUser() user: Person, @Query() query: BaseQueryDTO, @Body() body: CreateLeadDTO): Promise<LeadResponseDTO> {
    return this.leadService.update(user, query.id, body);
  }

  @ApiOkResponse({ description: 'Deletes lead', type: BaseMessageDTO, })
  @Access(AccessEnum.USER)
  @Delete()
  delete(@AuthUser() user: Person, @Query() query: BaseQueryDTO): Promise<BaseMessageDTO> {
    return this.leadService.delete(user, query.id);
  }
}
