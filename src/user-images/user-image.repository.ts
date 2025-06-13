import { EntityRepository } from 'typeorm';

import { BaseRepository } from '../common/base';
import { UserImage } from './user-image.entity';

@EntityRepository(UserImage)
export class UserImageRepository extends BaseRepository<UserImage> {}
