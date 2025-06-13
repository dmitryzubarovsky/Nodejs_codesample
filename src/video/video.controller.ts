import { Controller, Body, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { Access, AuthGuard, Roles } from '../common/decorators';
import { BaseController, BaseQueryDTO } from '../common/base';
import { VideoService } from './video.service';
import {
  UpdateVideoDTO,
  UpdateVideoResponseDTO
} from './DTO';
import { AccessEnum, AdminRoleEnum } from '../common/enums';

@AuthGuard()
@ApiBearerAuth()
@Controller('video')
@ApiTags('Video')
export class VideoController extends BaseController {
  constructor(private readonly videoService: VideoService) {
    super();
  }

  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, AdminRoleEnum.CONTENT, ])
  @Access(AccessEnum.ADMIN)
  @ApiOkResponse({ description: 'Returns updated video', type: UpdateVideoResponseDTO, })
  @Put()
  update(@Query() query: BaseQueryDTO, @Body() body: UpdateVideoDTO): Promise<UpdateVideoResponseDTO> {
    return this.videoService.update(query.id, body);
  }
}
