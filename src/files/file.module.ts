import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FileService } from './file.service';
import { File } from './file.entity';
import { FileRepository } from './file.repository';

@Module({
  providers: [ FileService, ],
  imports: [ TypeOrmModule.forFeature([ File, FileRepository, ]), ],
  exports: [ FileService, ],
})
export class FileModule {}
