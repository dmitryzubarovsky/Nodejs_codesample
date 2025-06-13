import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ nullable: true, })
  updatedAt: Date;

  @ApiProperty({ nullable: true, })
  deletedAt: Date;
}

export class BadRequestDTO {
  @ApiProperty()
  statusCode: number;

  @ApiProperty({
    oneOf: [
      { type: 'string', },
      { type: 'Array<string>', },
    ],
    required: true,
  })
  error: 'string' | 'Array<string>';

  @ApiProperty()
  message: string;
}

export class BaseErrorResponseDTO {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  error: string;

  @ApiProperty()
  message: string;
}

export class BaseMessageDTO {
  @ApiProperty()
  message: string;
}
