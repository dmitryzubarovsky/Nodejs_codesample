import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserImageService } from './user-image.service';
import { UserImageController } from './user-image.controller';
import { UserImage } from './user-image.entity';
import { UserImageRepository } from './user-image.repository';
import { UserModule } from '../users/user.module';
import { ImageModule } from '../images/image.module';

@Module({
  controllers: [ UserImageController, ],
  providers: [ UserImageService, ],
  imports: [
    TypeOrmModule.forFeature([ UserImage, UserImageRepository, ]),
    forwardRef(() => UserModule),
    forwardRef(() => ImageModule),
  ],
  exports: [ UserImageService, ],
})
export class UserImageModule {}
