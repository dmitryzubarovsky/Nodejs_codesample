import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { TrainingCategoryService } from './training-category.service';
import { Access, AuthGuard, Roles } from '../common/decorators';
import { BaseController, BaseMessageDTO, BaseQueryDTO } from '../common/base';
import { AccessEnum, AdminRoleEnum } from '../common/enums';
import {
  AllTrainingCategoriesResponseDTO,
  CreateTrainingCategoryDTO,
  CreateTrainingCategoryResponseDTO,
  TrainingCategoryResponseAdminDTO,
  TrainingCategoryResponseDTO,
  UpdateTrainingCategoryDTO,
  UpdateTrainingCategoryResponseDTO
} from './DTO';
import { AuthUser } from '../auth/decorators';
import { Person } from '../auth/models';

@ApiBearerAuth()
@AuthGuard()
@Controller('training-categories')
@ApiTags('Training-categories')
export class TrainingCategoryController extends BaseController {
  constructor(private readonly trainingCategoryService: TrainingCategoryService) {
    super();
  }

  @ApiCreatedResponse({ description: 'Returns created training category', type: CreateTrainingCategoryResponseDTO, })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, AdminRoleEnum.CONTENT, ])
  @Access(AccessEnum.ADMIN)
  @Post()
  create(@Body() body: CreateTrainingCategoryDTO): Promise<CreateTrainingCategoryResponseDTO> {
    return this.trainingCategoryService.create(body);
  }

  @ApiOkResponse({ description: 'Returns training categories for admin', type: [ TrainingCategoryResponseAdminDTO, ], })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, AdminRoleEnum.CONTENT, ])
  @Access(AccessEnum.ADMIN)
  @Get('all/admin')
  readAllForAdmin(): Promise<Array<TrainingCategoryResponseAdminDTO>> {
    return this.trainingCategoryService.readAllForAdmin();
  }

  @ApiOkResponse({ description: 'Returns training categories', type: [ AllTrainingCategoriesResponseDTO, ], })
  @Access(AccessEnum.USER)
  @Get('all/user')
  readAllForUser(@AuthUser() user: Person): Promise<Array<AllTrainingCategoriesResponseDTO>> {
    return this.trainingCategoryService.readAllForUser(user);
  }

  @ApiOkResponse({ description: 'Returns training category by id', type: TrainingCategoryResponseAdminDTO, })
  @Access(AccessEnum.ADMIN)
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, AdminRoleEnum.CONTENT, ])
  @Get('admin')
  readForAdmin(@Query() query: BaseQueryDTO): Promise<TrainingCategoryResponseAdminDTO> {
    return this.trainingCategoryService.readForAdmin(query.id);
  }

  @ApiOkResponse({ description: 'Returns training category by id', type: TrainingCategoryResponseDTO, })
  @Access(AccessEnum.USER)
  @Get('user')
  readForUser(@AuthUser() user: Person, @Query() query: BaseQueryDTO): Promise<TrainingCategoryResponseDTO> {
    return this.trainingCategoryService.readForUser(user, query.id);
  }

  @ApiOkResponse({ description: 'Returns updated training category', type: UpdateTrainingCategoryResponseDTO, })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, AdminRoleEnum.CONTENT, ])
  @Access(AccessEnum.ADMIN)
  @Put()
  update(@Query() query: BaseQueryDTO, @Body() body: UpdateTrainingCategoryDTO): Promise<UpdateTrainingCategoryResponseDTO> {
    return this.trainingCategoryService.update(query.id, body);
  }

  @ApiOkResponse({ description: 'Returns delete message', type: BaseMessageDTO, })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, AdminRoleEnum.CONTENT, ])
  @Access(AccessEnum.ADMIN)
  @Delete()
  delete(@Query() query: BaseQueryDTO): Promise<BaseMessageDTO> {
    return this.trainingCategoryService.delete(query.id);
  }
}
