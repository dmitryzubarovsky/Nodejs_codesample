import { BadRequestException, ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { TrainingRepository } from './training.repository';
import { TrainingCategoryService } from '../training-categories/training-category.service';
import { VideoService } from '../video/video.service';
import type { Training } from './training.entity';
import type { BaseMessageDTO } from '../common/base';
import type {
  AllTrainingsUserResponseDTO,
  CreateTrainingDTO,
  ReadTrainingDTO,
  ReadTrainingUserDTO,
  TrainingResponseDTO,
  UpdateTrainingDTO
} from './DTO';
import type { TrainingCategory } from '../training-categories/training-category.entity';
import type { Person } from '../auth/models';
import { vimeoUrl } from '../common/constants';
import type { Video } from '../video/video.entity';

@Injectable()
export class TrainingService {
  constructor(
    private readonly trainingRepository: TrainingRepository,
    @Inject(forwardRef(() => VideoService))
    private readonly videoService: VideoService,
    @Inject(forwardRef(() => TrainingCategoryService))
    private trainingCategoryService : TrainingCategoryService
  ) { }

  async create(body: CreateTrainingDTO): Promise<TrainingResponseDTO> {
    const { videoId, categoryId, ...training } = body;
    const video = await this.videoService.readVideoById(videoId);
    const recordIsExist = !!await this.trainingRepository.readEntity({ where: { video, }, });
    if (recordIsExist) {
      throw new BadRequestException('Training with this video id already exist ');
    }
    const category = await this.trainingCategoryService.readTrainingCategoryById(categoryId);
    const createdEntity = await this.trainingRepository.createEntity({ video, category, ...training, });
    return { ...createdEntity, categoryId: category.id, };
  }

  async readForUser(id: number, user: Person): Promise<ReadTrainingUserDTO> {
    const { video, category, ...training } = await this.readTrainingById(id, [ 'video', 'category', ]);
    if (await user.level < training.level) {
      throw new ForbiddenException('The client doesn\'t have sufficient permissions');
    }
    const videoWithFiles = await this.videoService.readVideoByIdWithDirectLinks(video.id);
    return {
      ...training,
      categoryId: category.id,
      categoryTitle: category.title,
      link: videoWithFiles.link,
      files: videoWithFiles.files,
      previewImageId: videoWithFiles.previewImageId,
    };
  }

  async readForAdmin(id: number): Promise<ReadTrainingDTO> {
    const { video, category, ...training } = await this.readTrainingById(id, [ 'video', 'category', ]);
    return {
      ...training,
      previewImageId: video.previewImageId,
      link: vimeoUrl + video.thirdPartyVideoId,
      videoId: video.id,
      categoryId: category.id,
      categoryTitle: category.title,
    };
  }

  async readAllForUser(user: Person, categoryId?: number): Promise<Array<AllTrainingsUserResponseDTO>> {
    return this.trainingRepository.getAllUser(await user.level, categoryId);
  }

  readAllForAdmin(categoryId?: number): Promise<Array<ReadTrainingDTO>> {
    return this.trainingRepository.getAllAdmin(categoryId);
  }

  async readFeed(user: Person): Promise<Array<ReadTrainingDTO>> {
    return this.trainingRepository.readFeed(await user.level);
  }

  async update(id: number, body: UpdateTrainingDTO): Promise<TrainingResponseDTO> {
    await this.readTrainingById(id);
    const { categoryId, ...training } = body;
    const category = await this.trainingCategoryService.readTrainingCategoryById(categoryId);
    const createdTraining = await this.trainingRepository.updateEntity(id, { category, ...training, });
    return { ...createdTraining, categoryId: category.id, };
  }

  async delete(id: number): Promise<BaseMessageDTO> {
    const training = await this.readTrainingById(id, [ 'video', ]);
    await this.videoService.delete(training.video.id);
    return { message: 'The entity was successfully deleted', };
  }

  async readTrainingById(id: number, relations?: Array<string>): Promise<Training> {
    const training = await this.trainingRepository.readEntityById(id, { relations, });
    if (!training) {
      throw new NotFoundException('The entity with this id was not found');
    }
    return training;
  }

  async deleteCategory(category: TrainingCategory): Promise<void> {
    const trainings = await this.trainingRepository.readAllEntities({ where: { category, }, });
    trainings.map(value => {
      return this.delete(value.id);
    });
  }

  async softDeleteByVideo(video: Video): Promise<BaseMessageDTO> {
    const training = await this.trainingRepository.readEntity({ where: { video, }, });
    if (training) {
      await this.trainingRepository.softDeleteEntity(training.id);
    }
    return { message: 'The entity was successfully deleted', };
  }
}
