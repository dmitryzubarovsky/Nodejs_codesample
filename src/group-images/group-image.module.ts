import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GroupImageRepository } from './group-image.repository';
import { GroupImageController } from './group-image.controller';
import { GroupImageService } from './group-image.service';
import { GroupModule } from '../groups/group.module';
import { ImageModule } from '../images/image.module';
import { GroupImage } from './group-image.entity';
import { UserModule } from '../users/user.module';
import { GroupUsersModule } from '../group-users/group-users.module';

@Module({
  controllers: [ GroupImageController, ],
  providers: [ GroupImageService, ],
  imports: [
    TypeOrmModule.forFeature([ GroupImage, GroupImageRepository, ]),
    forwardRef(() => GroupModule),
    forwardRef(() => ImageModule),
    forwardRef(() => UserModule),
    forwardRef(() => GroupUsersModule),
  ],
  exports: [ GroupImageService, ],
})
export class GroupImageModule {}
