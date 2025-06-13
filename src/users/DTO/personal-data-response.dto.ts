import { ApiProperty } from '@nestjs/swagger';

export class PersonalDataResponseDTO {
  @ApiProperty()
  id: number;

  @ApiProperty({ nullable: true, })
  profession: string;

  @ApiProperty({ nullable: true, })
  birthDate: Date;

  @ApiProperty({ nullable: true, })
  about: string;
}
