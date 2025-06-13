import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDTO } from '../../common/base';

export class ImageDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  imageId: number;
}

export class ComplaintResponseDTO extends BaseResponseDTO {
  @ApiProperty({ nullable: true, })
  userId: number;

  @ApiProperty({ nullable: true, })
  userAvatarImageId: number;

  @ApiProperty({ nullable: true, })
  groupId: number;

  @ApiProperty({ nullable: true, })
  groupAvatarImageId: number;

  @ApiProperty()
  isIndecent: boolean;

  @ApiProperty()
  isRude: boolean;

  @ApiProperty()
  isSensitive: boolean;

  @ApiProperty()
  description: string;

  @ApiProperty({ isArray: true, type: ImageDTO, nullable: true, })
  userImages: Array<ImageDTO>;

  @ApiProperty({ isArray: true, type: ImageDTO, nullable: true, })
  groupImages: Array<ImageDTO>;
}
