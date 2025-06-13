import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

import { StorageContainerEnum } from '../../common/enums';

export class UploadImageTypeDTO {
  @IsEnum(StorageContainerEnum)
  @IsNotEmpty()
  @ApiProperty({ enum: StorageContainerEnum, })
  type: StorageContainerEnum;
}
