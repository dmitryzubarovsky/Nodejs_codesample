import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Put, Query } from '@nestjs/common';

import { BaseController, BaseQueryDTO } from '../common/base';
import { UserDocumentService } from './user-document.service';
import { Access, AuthGuard, Roles } from '../common/decorators';
import { AccessEnum, AdminRoleEnum } from '../common/enums';
import { AuthUser } from '../auth/decorators';
import { Person } from '../auth/models';
import {
  DocumentsStatusResponseDTO,
  GetAllDocumentsDTO,
  GetDocumentResponseDTO,
  GetDocumentsResponseDTO,
  UpdateDocumentsDTO,
  UpdateDocumentsResponseDTO
} from './DTO';

@AuthGuard()
@ApiBearerAuth()
@Controller('user-documents')
@ApiTags('Users-documents')
export class UserDocumentController extends BaseController {
  constructor(private readonly usersDocumentsService: UserDocumentService) {
    super();
  }

  @ApiOkResponse({ description: 'Returns user\'s documents', type:  [ GetDocumentsResponseDTO, ], })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, AdminRoleEnum.FINANCIAL, ])
  @Access(AccessEnum.ADMIN)
  @Get('all/admin')
  readAllByAdmin(@AuthUser() user: Person, @Query() query: GetAllDocumentsDTO): Promise<Array<GetDocumentsResponseDTO>> {
    return this.usersDocumentsService.readAllByAdmin(user, query);
  }

  @ApiOkResponse({ description: 'Return updated document', type: UpdateDocumentsResponseDTO, })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, AdminRoleEnum.FINANCIAL, ])
  @Access(AccessEnum.ADMIN)
  @Put()
  update(@AuthUser() person: Person, @Query() query: BaseQueryDTO, @Body() body: UpdateDocumentsDTO): Promise<UpdateDocumentsResponseDTO> {
    return this.usersDocumentsService.update(query.id, body);
  }

  @ApiOkResponse({ description: 'Returns document', type: GetDocumentResponseDTO, })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, AdminRoleEnum.FINANCIAL, ])
  @Access(AccessEnum.ADMIN)
  @Get()
  read(@AuthUser() user: Person, @Query() query: BaseQueryDTO): Promise<GetDocumentResponseDTO> {
    return this.usersDocumentsService.read(query.id);
  }

  @ApiOkResponse({ description: 'Returns status for chosen user document', type: DocumentsStatusResponseDTO, })
  @Access(AccessEnum.USER)
  @Get('status')
  readStatus(@AuthUser() user: Person): Promise<DocumentsStatusResponseDTO> {
    return this.usersDocumentsService.getDocumentStatus(user.userId);
  }

}
