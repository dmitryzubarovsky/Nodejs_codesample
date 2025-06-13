import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComplaintController } from './complaint.controller';
import { ComplaintService } from './complaint.service';
import { Complaint } from './complaint.entity';
import { ComplaintRepository } from './complaint.repository';
import { UserModule } from '../users/user.module';
import { GroupModule } from '../groups/group.module';
import { UserImageModule } from '../user-images/user-image.module';
import { GroupImageModule } from '../group-images/group-image.module';

@Module({
  controllers: [ ComplaintController, ],
  providers: [ ComplaintService, ],
  imports: [
    TypeOrmModule.forFeature([ Complaint, ComplaintRepository, ]),
    forwardRef(() => UserModule),
    forwardRef(() => GroupModule),
    forwardRef(() => UserImageModule),
    forwardRef(() => GroupImageModule),
  ],
})
export class ComplaintModule {}
