import { ApiProperty } from '@nestjs/swagger';

export class UpdateAddressResponseDTO {
  @ApiProperty()
  id: number;

  @ApiProperty({ nullable: true, })
  zip: string;

  @ApiProperty()
  countryId: number;

  @ApiProperty()
  stateId: number;

  @ApiProperty()
  city: string;

  @ApiProperty({ nullable: true, })
  district: string;

  @ApiProperty({ nullable: true, })
  street: string;

  @ApiProperty({ nullable: true, })
  house: string;

  @ApiProperty({ nullable: true, })
  apartment: string;
}
