import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailToken } from './mail-token.entity';
import { MailTokenRepository } from './mail-token.repository';
import { MailTokenService } from './mail-token.service';

@Module({
  providers: [ MailTokenService, ],
  imports: [
    TypeOrmModule.forFeature([ MailToken, MailTokenRepository, ] ),
  ],
  exports: [ MailTokenService, ],
})
export class MailTokenModule {}
