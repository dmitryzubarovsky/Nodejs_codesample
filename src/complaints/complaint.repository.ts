import { EntityRepository } from 'typeorm';

import { Complaint } from './complaint.entity';
import { BaseRepository } from '../common/base';

@EntityRepository(Complaint)
export class ComplaintRepository extends BaseRepository<Complaint> {}
