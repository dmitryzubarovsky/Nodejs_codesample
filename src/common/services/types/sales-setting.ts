import { UserLevelEnum } from '../../enums';

type LevelType = {
  stars: number,
  level: UserLevelEnum,
  levelTitle: string,
  salesToNextLevel: number,
};

type LevelStarThreshold = {
  stars: number;
  starPrice: number;
  timeLimit: number | null;
  direct: number;
  indirect: number;
};

export type SalesSetting = {
  levelStarThreshold: Record<number, LevelStarThreshold>;
  maxLevel: number;
  firstLevel: LevelType;
};
