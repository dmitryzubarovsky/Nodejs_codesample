import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { StorageContainerEnum } from '../../common/enums';
import { Transform } from 'class-transformer';
import { parseStringToInt } from '../../common/utilities/parsing.helper';

export class ImageIdQueryDTO {
  @IsNotEmpty()
  @Transform(id => parseStringToInt(id))
  @ApiProperty()
  imageId: number;

  @IsEnum(StorageContainerEnum)
  @IsNotEmpty()
  @ApiProperty({ enum: StorageContainerEnum, })
  containerName: StorageContainerEnum;
}
