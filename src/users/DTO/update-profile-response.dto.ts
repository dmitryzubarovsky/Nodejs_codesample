import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileResponseDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nickname: string;

  @ApiProperty({ nullable: true, })
  avatarImageId: number;
}
