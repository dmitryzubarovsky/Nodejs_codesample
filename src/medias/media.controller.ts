import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { Access, AuthGuard, Roles } from '../common/decorators';
import { BaseController, BaseMessageDTO, BaseQueryDTO } from '../common/base';
import { AccessEnum, AdminRoleEnum } from '../common/enums';
import { MediaService } from './media.service';
import {
  CreateMediaDTO,
  MediaResponseDTO,
  ReadAllMediasResponseDTO,
  ReadMediaDTO,
  UpdateMediaDTO,
  ReadMediaAdminDTO
} from './DTO';
import { feedItemsNumber } from '../common/constants';

@AuthGuard()
@ApiBearerAuth()
@Controller('medias')
@ApiTags('Medias')
export class MediaController extends BaseController {
  constructor(private readonly mediaService: MediaService) {
    super();
  }

  @ApiCreatedResponse({ description: 'Returns created media', type: MediaResponseDTO, })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, AdminRoleEnum.CONTENT, ])
  @Access(AccessEnum.ADMIN)
  @Post()
  create(@Body() body: CreateMediaDTO): Promise<MediaResponseDTO> {
    return this.mediaService.create(body);
  }

  @ApiOkResponse({ description: 'Returns media by id', type: ReadMediaDTO, })
  @Access(AccessEnum.USER)
  @Get('user')
  readForUser(@Query() query: BaseQueryDTO): Promise<ReadMediaDTO> {
    return this.mediaService.readForUser(query.id);
  }

  @ApiOkResponse({ description: 'Returns media by id', type: ReadMediaAdminDTO, })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, AdminRoleEnum.CONTENT, ])
  @Access(AccessEnum.ADMIN)
  @Get('admin')
  readFor(@Query() query: BaseQueryDTO): Promise<ReadMediaAdminDTO> {
    return this.mediaService.readForAdmin(query.id);
  }

  @ApiOkResponse({ description: 'Returns all videos', type: [ ReadAllMediasResponseDTO, ], })
  @Access(AccessEnum.USER)
  @Get('all/user')
  readAllForUser(): Promise<Array<ReadAllMediasResponseDTO>> {
    return this.mediaService.readAllForUser();
  }

  @ApiOkResponse({ description: 'Returns all videos', type: [ ReadAllMediasResponseDTO, ], })
  @Access(AccessEnum.ADMIN)
  @Get('all/admin')
  readAllForAdmin(): Promise<Array<ReadAllMediasResponseDTO>> {
    return this.mediaService.readAllForAdmin();
  }

  @ApiOkResponse({ description: 'Returns medias feed', type: [ ReadAllMediasResponseDTO, ], })
  @Access(AccessEnum.USER)
  @Get('feed')
  readFeed(): Promise<Array<ReadAllMediasResponseDTO>> {
    return this.mediaService.readAllForUser(feedItemsNumber);
  }

  @ApiOkResponse({ description: 'Returns updated media', type: MediaResponseDTO, })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, AdminRoleEnum.CONTENT, ])
  @Access(AccessEnum.ADMIN)
  @Put()
  update(@Query() query: BaseQueryDTO, @Body() body: UpdateMediaDTO): Promise<MediaResponseDTO> {
    return this.mediaService.update(query.id, body);
  }

  @ApiOkResponse({ description: 'Returns delete message', type: BaseMessageDTO, })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, AdminRoleEnum.CONTENT, ])
  @Access(AccessEnum.ADMIN)
  @Delete()
  delete(@Query() query: BaseQueryDTO): Promise<BaseMessageDTO> {
    return this.mediaService.delete(query.id);
  }
}
