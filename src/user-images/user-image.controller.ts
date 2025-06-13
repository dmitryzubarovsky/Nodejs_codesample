import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Delete, Query } from '@nestjs/common';

import { BaseController, BaseMessageDTO, BaseUserIdQueryDTO } from '../common/base';
import { UserImageService } from './user-image.service';
import { Access, AuthGuard } from '../common/decorators';
import { Person } from '../auth/models';
import { AuthUser } from '../auth/decorators';
import {
  CreateUserImageDTO,
  UserImageResponseDTO,
  CreateUserImageResponseDTO
} from './DTO';
import { AccessEnum } from '../common/enums';
import { MassDeleteDTO } from '../common/DTO';

@AuthGuard()
@ApiBearerAuth()
@Controller('user-images')
@ApiTags('User-images')
export class UserImageController extends BaseController {
  constructor(private readonly userImagesService: UserImageService) {
    super();
  }

  @ApiCreatedResponse({ description: 'Returns created user-image', type: CreateUserImageResponseDTO, })
  @Access(AccessEnum.USER)
  @Post()
  create(@AuthUser() user: Person, @Body() body: CreateUserImageDTO): Promise<CreateUserImageResponseDTO> {
    return this.userImagesService.create(user.userId, body.imageId);
  }

  @ApiOkResponse({ description: 'Returns all user-images', type: [ UserImageResponseDTO, ], })
  @Access(AccessEnum.USER)
  @Get('all')
  readAll(@Query() query: BaseUserIdQueryDTO): Promise<Array<UserImageResponseDTO>> {
    return this.userImagesService.readAll(query.userId);
  }

  @ApiOkResponse({ description: 'Returns delete status', type: BaseMessageDTO, })
  @Access(AccessEnum.USER)
  @Delete()
  delete(@AuthUser() user: Person, @Body() body: MassDeleteDTO): Promise<BaseMessageDTO> {
    return this.userImagesService.delete(user.userId, body.ids);
  }
}
