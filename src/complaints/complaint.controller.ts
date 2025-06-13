import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { BaseController, BaseMessageDTO, BaseQueryDTO } from '../common/base';
import { ComplaintResponseDTO, CreateComplaintDTO } from './DTO';
import { ComplaintService } from './complaint.service';
import { Access, Roles, AuthGuard } from '../common/decorators';
import { AccessEnum, AdminRoleEnum } from '../common/enums';

@ApiBearerAuth()
@AuthGuard()
@ApiTags('Complaints')
@Controller('complaints')
export class ComplaintController extends BaseController {
  constructor(private readonly complaintService: ComplaintService) {
    super();
  }

  @ApiCreatedResponse({ description: 'Returns created complaint', type: ComplaintResponseDTO, })
  @Access(AccessEnum.USER)
  @Post()
  create(@Body() body: CreateComplaintDTO): Promise<ComplaintResponseDTO> {
    return this.complaintService.create(body);
  }

  @ApiOkResponse({ description: 'Returns complaints', type: [ ComplaintResponseDTO, ], })
  @Access(AccessEnum.ADMIN)
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, AdminRoleEnum.CONTENT, ])
  @Get('all')
  readAll(): Promise<Array<ComplaintResponseDTO>> {
    return this.complaintService.readAll();
  }

  @ApiOkResponse({ description: 'Approves complaint', type: BaseMessageDTO, })
  @Access(AccessEnum.ADMIN)
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, AdminRoleEnum.CONTENT, ])
  @Patch('approve')
  approve(@Query() query: BaseQueryDTO): Promise<BaseMessageDTO> {
    return this.complaintService.approve(query.id);
  }

  @ApiOkResponse({ description: 'Deletes complaint', type: BaseMessageDTO, })
  @Access(AccessEnum.ADMIN)
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, AdminRoleEnum.CONTENT, ])
  @Delete()
  delete(@Query() query: BaseQueryDTO): Promise<BaseMessageDTO> {
    return this.complaintService.delete(query.id);
  }
}
