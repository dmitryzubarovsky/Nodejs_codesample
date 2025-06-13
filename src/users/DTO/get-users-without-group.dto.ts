import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { parseBoolean } from '../../common/utilities/parsing.helper';

export class GetUsersWithoutGroupDTO {
  @IsNotEmpty()
  @IsBoolean()
  @Transform(status => parseBoolean(status), { toClassOnly: true, })
  @ApiProperty()
  goalGetterI: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(status => parseBoolean(status), { toClassOnly: true, })
  @ApiProperty()
  goalGetterII: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(status => parseBoolean(status), { toClassOnly: true, })
  @ApiProperty()
  leaderI: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(status => parseBoolean(status), { toClassOnly: true, })
  @ApiProperty()
  leaderII: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(status => parseBoolean(status), { toClassOnly: true, })
  @ApiProperty()
  trueLeaderI: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(status => parseBoolean(status), { toClassOnly: true, })
  @ApiProperty()
  trueLeaderII: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(status => parseBoolean(status), { toClassOnly: true, })
  @ApiProperty()
  master: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(status => parseBoolean(status), { toClassOnly: true, })
  @ApiProperty()
  ultimateChallenge: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, })
  search: string;
}
