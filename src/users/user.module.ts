import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { ImageModule } from '../images/image.module';
import { MailModule } from '../mail/mail.module';
import { SaleModule } from '../sales/sale.module';
import { GroupUsersModule } from '../group-users/group-users.module';
import { SettingsModule } from '../settings/settings.module';
import { FileModule } from '../files/file.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { MailTokenModule } from '../mail-tokens/mail-token.module';
import { UserDocumentModule } from '../user-documents/user-document.module';

@Module({
  controllers: [ UserController, ],
  providers: [ UserService, ],
  imports: [
    TypeOrmModule.forFeature([ User, UserRepository, ]),
    forwardRef(() => ImageModule),
    forwardRef(() => MailModule),
    forwardRef(() => GroupUsersModule),
    forwardRef(() => SaleModule),
    forwardRef(() => SettingsModule),
    forwardRef(() => FileModule),
    forwardRef(() => TransactionsModule),
    forwardRef(() => MailTokenModule),
    forwardRef(() => UserDocumentModule),
  ],
  exports: [ UserService, ],
})
export class UserModule {}
