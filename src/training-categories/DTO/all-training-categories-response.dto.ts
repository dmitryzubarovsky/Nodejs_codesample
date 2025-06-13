import { ApiProperty } from '@nestjs/swagger';
import { UserLevelEnum } from '../../common/enums';

import { BaseResponseDTO } from '../../common/base';
import { levelExamples } from '../../common/constants';

export class TrainingDTO extends BaseResponseDTO {
    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty({ enum: levelExamples, })
    level: UserLevelEnum;

    @ApiProperty({ nullable: true, })
    previewImageId: number;
}

export class AllTrainingCategoriesResponseDTO extends BaseResponseDTO {
    @ApiProperty()
    title: string;

    @ApiProperty({ enum: levelExamples, })
    level: UserLevelEnum;

    @ApiProperty({ isArray: true, type: TrainingDTO, })
    trainings: Array<TrainingDTO>;
}
