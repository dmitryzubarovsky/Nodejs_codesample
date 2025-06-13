import { EntityRepository } from 'typeorm';

import { GroupImage } from './group-image.entity';
import { BaseRepository } from '../common/base';

@EntityRepository(GroupImage)
export class GroupImageRepository extends BaseRepository<GroupImage> {}
