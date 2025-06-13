import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { Group } from './group.entity';
import { GroupRepository } from './group.repository';
import { UserModule } from '../users/user.module';
import { ImageModule } from '../images/image.module';
import { GroupUsersModule } from '../group-users/group-users.module';
import { SaleModule } from '../sales/sale.module';
import { MailModule } from '../mail/mail.module';

@Module({
  controllers: [ GroupController, ],
  providers: [ GroupService, ],
  imports: [
    TypeOrmModule.forFeature([ Group, GroupRepository, ]),
    forwardRef(() => UserModule),
    forwardRef(() => ImageModule),
    forwardRef(() => GroupUsersModule),
    forwardRef(() => SaleModule),
    forwardRef(() => MailModule),
  ],
  exports: [ GroupService, ],
})
export class GroupModule {}
