import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LessThanOrEqual } from 'typeorm';

import { TrainingCategoryRepository } from './training-category.repository';
import type { BaseMessageDTO } from '../common/base';
import type { TrainingCategory } from './training-category.entity';
import type {
  AllTrainingCategoriesResponseDTO,
  CreateTrainingCategoryDTO,
  CreateTrainingCategoryResponseDTO,
  TrainingCategoryResponseAdminDTO,
  TrainingCategoryResponseDTO,
  UpdateTrainingCategoryDTO,
  UpdateTrainingCategoryResponseDTO
} from './DTO';
import { TrainingService } from '../trainings/training.service';
import type { Person } from '../auth/models';

@Injectable()
export class TrainingCategoryService {
  constructor(
    private readonly trainingCategoryRepository: TrainingCategoryRepository,
    @Inject(forwardRef(() => TrainingService))
    private readonly trainingService: TrainingService
  ) {}

  create(body: CreateTrainingCategoryDTO): Promise<CreateTrainingCategoryResponseDTO> {
    return this.trainingCategoryRepository.createEntity(body);
  }

  async readAllForUser(user: Person): Promise<Array<AllTrainingCategoriesResponseDTO>> {
    const userLevel = await user.level;
    const dataFromDb = await this.trainingCategoryRepository.readAllEntities({
      relations: [ 'trainings', 'trainings.video', ],
      where: {
        level: LessThanOrEqual(userLevel),
      },
    });
    return dataFromDb.map(category => ({
      ...category,
      level: undefined,
      trainings: category.trainings
        .filter(training => training.level <= userLevel)
        .map(({ video, ...training }) =>
          ({ ...training, previewImageId: video.previewImageId, level: undefined, })
        ),
    }));
  }

  readAllForAdmin(): Promise<Array<TrainingCategoryResponseAdminDTO>> {
    return this.trainingCategoryRepository.readAllEntities();
  }

  readForAdmin(id: number): Promise<TrainingCategoryResponseAdminDTO> {
    return this.readTrainingCategoryById(id);
  }

  async readForUser(user: Person, id: number): Promise<TrainingCategoryResponseDTO> {
    const training = await this.readTrainingCategoryById(id);
    if (await user.level < training.level) {
      throw new ForbiddenException('The client doesn\'t have sufficient permissions');
    }
    delete training.level;
    return training;
  }

  async update(id: number, body: UpdateTrainingCategoryDTO): Promise<UpdateTrainingCategoryResponseDTO> {
    const trainingCategory = await this.readTrainingCategoryById(id);
    return this.trainingCategoryRepository.updateEntity(trainingCategory.id, body);
  }

  async delete(id: number): Promise<BaseMessageDTO> {
    const category = await this.readTrainingCategoryById(id);
    await this.trainingCategoryRepository.softDeleteEntity(id);
    await this.trainingService.deleteCategory(category);
    return { message: 'The training category was successfully deleted', };
  }

  async readTrainingCategoryById(id: number): Promise<TrainingCategory> {
    const trainingCategory = await this.trainingCategoryRepository.readEntityById(id);
    if (!trainingCategory) {
      throw new NotFoundException('The training category with this id was not found');
    }
    return trainingCategory;
  }
}
