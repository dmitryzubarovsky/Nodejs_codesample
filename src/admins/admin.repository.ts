import { EntityRepository } from 'typeorm';

import { BaseRepository } from '../common/base';
import { Admin } from './admin.entity';


export class AdminRepository extends BaseRepository<Admin> {}
