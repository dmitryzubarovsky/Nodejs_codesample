import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailService } from './mail.service';
import { GlossaryModule } from '../glossaries/glossary.module';
import { UserModule } from '../users/user.module';
import { AppConfigModule } from '../common/services/app-config.module';
import { User } from '../users/user.entity';
import { UserRepository } from '../users/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ User, UserRepository, ]),
    forwardRef(() => UserModule),
    forwardRef(() => GlossaryModule),
    AppConfigModule,
  ],
  providers: [ MailService, ],
  exports: [ MailService, ],
})
export class MailModule { }
