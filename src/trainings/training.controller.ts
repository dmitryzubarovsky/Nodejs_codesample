import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { Access, AuthGuard, Roles } from '../common/decorators';
import { BaseController, BaseMessageDTO, BaseQueryDTO } from '../common/base';
import { TrainingService } from './training.service';

import { AccessEnum, AdminRoleEnum } from '../common/enums';
import {
  AllTrainingsUserResponseDTO,
  CreateTrainingDTO,
  ReadAllTrainingsDTO,
  ReadTrainingDTO,
  ReadTrainingUserDTO,
  TrainingResponseDTO,
  UpdateTrainingDTO
} from './DTO';
import { Person } from '../auth/models';
import { AuthUser } from '../auth/decorators';

@AuthGuard()
@ApiBearerAuth()
@Controller('trainings')
@ApiTags('Trainings')
export class TrainingController extends BaseController {
  constructor(private readonly trainingService: TrainingService) {
    super();
  }

  @ApiCreatedResponse({ description: 'Returns created training', type: TrainingResponseDTO, })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, AdminRoleEnum.CONTENT, ])
  @Access(AccessEnum.ADMIN)
  @Post()
  create(@Body() body: CreateTrainingDTO): Promise<TrainingResponseDTO> {
    return this.trainingService.create(body);
  }

  @ApiOkResponse({ description: 'Returns training by id', type: ReadTrainingDTO, })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, AdminRoleEnum.CONTENT, ])
  @Access(AccessEnum.ADMIN)
  @Get('admin')
  readForAdmin(@AuthUser() user: Person, @Query() query: BaseQueryDTO): Promise<ReadTrainingDTO> {
    return this.trainingService.readForAdmin(query.id);
  }

  @ApiOkResponse({ description: 'Returns training by id', type: ReadTrainingDTO, })
  @Access(AccessEnum.USER)
  @Get('user')
  readForUser(@AuthUser() user: Person, @Query() query: BaseQueryDTO): Promise<ReadTrainingUserDTO> {
    return this.trainingService.readForUser(query.id, user);
  }

  @ApiOkResponse({ description: 'Returns all trainings by categoryId', type: [ AllTrainingsUserResponseDTO, ], })
  @Access(AccessEnum.USER)
  @Get('all/user')
  readAllForUser(@AuthUser() user: Person, @Query() query: ReadAllTrainingsDTO): Promise<Array<AllTrainingsUserResponseDTO>> {
    return this.trainingService.readAllForUser(user, query.categoryId);
  }

  @ApiOkResponse({ description: 'Returns all videos by category for admin', type: [ ReadTrainingDTO, ], })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, AdminRoleEnum.CONTENT, ])
  @Access(AccessEnum.ADMIN)
  @Get('all/admin')
  readAllForAdmin(@Query() query: ReadAllTrainingsDTO): Promise<Array<ReadTrainingDTO>> {
    return this.trainingService.readAllForAdmin(query.categoryId);
  }

  @ApiOkResponse({ description: 'Returns trainings feeds', type: [ ReadTrainingDTO, ], })
  @Access(AccessEnum.USER)
  @Get('feed')
  readFeed(@AuthUser() user: Person): Promise<Array<ReadTrainingDTO>> {
    return this.trainingService.readFeed(user);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns updated training', type: TrainingResponseDTO, })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, AdminRoleEnum.CONTENT, ])
  @Access(AccessEnum.ADMIN)
  @Put()
  update(@Query() query: BaseQueryDTO, @Body() body: UpdateTrainingDTO): Promise<TrainingResponseDTO> {
    return this.trainingService.update(query.id, body);
  }

  @ApiOkResponse({ description: 'Returns delete message', type: BaseMessageDTO, })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, AdminRoleEnum.CONTENT, ])
  @Access(AccessEnum.ADMIN)
  @Delete()
  delete(@Query() query: BaseQueryDTO): Promise<BaseMessageDTO> {
    return this.trainingService.delete(query.id);
  }
}
