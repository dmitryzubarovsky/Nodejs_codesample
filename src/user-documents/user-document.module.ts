import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserDocumentService } from './user-document.service';
import { UserDocumentRepository } from './user-document.repository';
import { UsersDocuments } from './user-document.entity';
import { UserDocumentController } from './user-document.controller';
import { FileModule } from '../files/file.module';
import { UserModule } from '../users/user.module';
import { MailModule } from '../mail/mail.module';

@Module({
  controllers: [ UserDocumentController, ],
  providers: [ UserDocumentService, ],
  imports: [
    TypeOrmModule.forFeature([ UsersDocuments, UserDocumentRepository, ]),
    forwardRef(() => FileModule),
    forwardRef(() => UserModule),
    forwardRef(() => MailModule),
  ],
  exports: [ UserDocumentService, ],
})
export class UserDocumentModule {}
