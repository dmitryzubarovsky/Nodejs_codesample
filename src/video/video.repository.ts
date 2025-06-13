import { EntityRepository } from 'typeorm';

import { BaseRepository } from '../common/base';
import { Video } from './video.entity';

@EntityRepository(Video)
export class VideoRepository extends BaseRepository<Video> {}
