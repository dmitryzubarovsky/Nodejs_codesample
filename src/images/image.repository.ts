import { EntityRepository } from 'typeorm';

import { BaseRepository } from '../common/base';
import { Image } from './image.entity';

@EntityRepository(Image)
export class ImageRepository extends BaseRepository<Image> {}
