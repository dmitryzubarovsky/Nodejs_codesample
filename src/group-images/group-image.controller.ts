import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Query, Delete } from '@nestjs/common';

import { BaseController, BaseMessageDTO } from '../common/base';
import { GroupImageService } from './group-image.service';
import { Access, AuthGuard, IsGroupAdmin } from '../common/decorators';
import { Person } from '../auth/models';
import { AuthUser } from '../auth/decorators';
import {
  CreateGroupImageDTO,
  CreateGroupImageResponseDTO,
  GetGroupImageResponseDTO
} from './DTO';
import { BaseGroupQueryDTO, MassDeleteDTO } from '../common/DTO';
import { AccessEnum } from '../common/enums';

@Controller('group-images')
@ApiTags('Group-images')
export class GroupImageController extends BaseController {
  constructor(private readonly groupImagesService: GroupImageService) {
    super();
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Returns created group-image', type: CreateGroupImageResponseDTO, })
  @Access(AccessEnum.USER)
  @Post()
  create(@AuthUser() user: Person, @Body() body: CreateGroupImageDTO): Promise<CreateGroupImageResponseDTO> {
    return this.groupImagesService.create(user, body);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns all group-images', type: [ GetGroupImageResponseDTO, ], })
  @Access(AccessEnum.USER)
  @Get('all')
  readAll(@Query() query: BaseGroupQueryDTO): Promise<Array<GetGroupImageResponseDTO>> {
    return this.groupImagesService.readAll(query.groupId);
  }

  @IsGroupAdmin()
  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns deleted status', type: BaseMessageDTO, })
  @Access(AccessEnum.USER)
  @Delete()
  delete(@AuthUser() person: Person, @Body() body: MassDeleteDTO): Promise<BaseMessageDTO> {
    return this.groupImagesService.delete(person, body.ids);
  }
}
