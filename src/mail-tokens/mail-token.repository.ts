import { EntityRepository } from 'typeorm';

import { BaseRepository } from '../common/base';
import { MailToken } from './mail-token.entity';

@EntityRepository(MailToken)
export class MailTokenRepository extends BaseRepository<MailToken> {}
