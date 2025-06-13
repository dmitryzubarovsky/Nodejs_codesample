import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GroupUsersService } from './group-users.service';
import { GroupUsers } from './group-users.entity';
import { GroupUsersRepository } from './group-users.repository';
import { GroupUsersController } from './group-users.controller';
import { GroupModule } from '../groups/group.module';
import { UserModule } from '../users/user.module';
import { MailModule } from '../mail/mail.module';
import { SaleModule } from '../sales/sale.module';
import { MailTokenModule } from '../mail-tokens/mail-token.module';

@Module({
  controllers: [ GroupUsersController, ],
  providers: [ GroupUsersService, ],
  imports: [
    TypeOrmModule.forFeature([ GroupUsers, GroupUsersRepository, ]),
    forwardRef(() => GroupModule),
    forwardRef(() => SaleModule),
    forwardRef(() => UserModule),
    forwardRef(() => MailModule),
    forwardRef(() => MailTokenModule),
  ],
  exports: [ GroupUsersService, ],
})
export class GroupUsersModule {}
