import { EntityRepository } from 'typeorm';

import { BaseRepository } from '../common/base';
import { Media } from './media.entity';

@EntityRepository(Media)
export class MediaRepository extends BaseRepository<Media> {}
