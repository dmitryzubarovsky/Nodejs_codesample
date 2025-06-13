import { EntityRepository } from 'typeorm';

import { BaseRepository } from '../common/base';
import { Settings } from './settings.entity';

@EntityRepository(Settings)
export class SettingsRepository extends BaseRepository<Settings> {}
