import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LeadController } from './lead.controller';
import { LeadService } from './lead.service';
import { Lead } from './lead.entity';
import { LeadRepository } from './lead.repository';
import { UserModule } from '../users/user.module';

@Module({
  controllers: [ LeadController, ],
  providers: [ LeadService, ],
  imports: [
    TypeOrmModule.forFeature([ Lead, LeadRepository, ]),
    UserModule,
  ],
  exports: [ LeadService, ],
})
export class LeadModule {}
