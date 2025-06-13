import { EntityRepository } from 'typeorm';

import { BaseRepository } from '../common/base';
import { Training } from './training.entity';
import { feedItemsNumber, vimeoUrl } from '../common/constants';
import type { AllTrainingsUserResponseDTO, ReadTrainingDTO } from './DTO';

@EntityRepository(Training)
export class TrainingRepository extends BaseRepository<Training> {

  getAllUser(level: number, categoryId?: number): Promise<Array<AllTrainingsUserResponseDTO>> {
    const options = [ level, ];
    let query = ` SELECT trainings.id,
                           trainings.created_at                AS "createdAt",
                           trainings.updated_at                AS "updatedAt",
                           trainings.deleted_at                AS "deletedAt",
                           trainings.title,      
                           videos.preview_image_id              AS "previewImageId"
            FROM trainings
                  LEFT JOIN videos ON videos.id = trainings.video_id AND videos.deleted_at IS NULL  
                  LEFT JOIN training_categories ON training_categories.id = trainings.category_id AND training_categories.deleted_at IS NULL 
            WHERE trainings.deleted_at IS NULL AND trainings.level <= $1`;
    if (categoryId) {
      options.push(categoryId);
      query += ' AND training_categories.id = $2';
    }
    return this.query(query, options);
  }

  getAllAdmin(categoryId?: number): Promise<Array<ReadTrainingDTO>> {
    const options = [];
    let query = ` SELECT trainings.id,
                           trainings.created_at                AS "createdAt",
                           trainings.updated_at                AS "updatedAt",
                           trainings.deleted_at                AS "deletedAt",
                           trainings.title,
                           description,
                           trainings.level,
                           videos.id                           AS "videoId",
            '${vimeoUrl}' || '' || videos.third_party_video_id AS "link",
                          videos.preview_image_id              AS "previewImageId",
                          training_categories.id               AS "categoryId",
                          training_categories.title            AS "categoryTitle"
            FROM trainings
                  LEFT JOIN videos ON videos.id = trainings.video_id AND videos.deleted_at IS NULL
                  LEFT JOIN training_categories ON training_categories.id = trainings.category_id AND training_categories.deleted_at IS NULL 
            WHERE trainings.deleted_at IS NULL`;
    if (categoryId) {
      options.push(categoryId);
      query += ' AND training_categories.id = $1';
    }
    return this.query(query, options);
  }

  readFeed(level: number): Promise<Array<ReadTrainingDTO>> {
    const query = ` SELECT trainings.id,
                           trainings.created_at                AS "createdAt",
                           trainings.updated_at                AS "updatedAt",
                           trainings.deleted_at                AS "deletedAt",
                           trainings.title,
                           description,
                           trainings.level,
                           videos.id                           AS "videoId",
            '${vimeoUrl}' || '' || videos.third_party_video_id AS "link",
                          videos.preview_image_id              AS "previewImageId",
                          training_categories.id               AS "categoryId",
                          training_categories.title            AS "categoryTitle"
            FROM trainings
                  LEFT JOIN videos ON videos.id = trainings.video_id AND videos.deleted_at IS NULL
                  LEFT JOIN training_categories ON training_categories.id = trainings.category_id AND training_categories.deleted_at IS NULL 
            WHERE trainings.deleted_at IS NULL AND trainings.level <= $1
            LIMIT $2`;
    return this.query(query, [ level, feedItemsNumber, ]);
  }
}
