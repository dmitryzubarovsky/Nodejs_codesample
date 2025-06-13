import { EntityRepository } from 'typeorm';

import { BaseRepository } from '../common/base';
import { File } from './file.entity';

@EntityRepository(File)
export class FileRepository extends BaseRepository<File> {}
