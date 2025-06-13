import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';

import { AdminRepository } from './admin.repository';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Admin } from './admin.entity';
import { MailModule } from '../mail/mail.module';
import { MailTokenModule } from '../mail-tokens/mail-token.module';

@Module({
  controllers: [ AdminController, ],
  imports: [
    TypeOrmModule.forFeature([ Admin, AdminRepository, ]),
    forwardRef(() => MailModule),
    forwardRef(() => MailTokenModule),
  ],
  providers: [ AdminService, ],
  exports: [ AdminService, ],
})
export class AdminModule {}
