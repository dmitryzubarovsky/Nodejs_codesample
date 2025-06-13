import { ApiProperty } from '@nestjs/swagger';

export class VimeoFileDTO {
  @ApiProperty()
  fps: number;

  @ApiProperty()
  width: number;

  @ApiProperty()
  height: number;

  @ApiProperty()
  size: number;

  @ApiProperty()
  type: string;

  @ApiProperty()
  link: string;
}
