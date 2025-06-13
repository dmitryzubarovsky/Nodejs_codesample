import { ReadLeadAllDTO } from '../DTO';
import { LeadStatusEnum, OrderByEnum, Sorting } from '../../common/enums';

export type QueryStatusesDTO = Omit<ReadLeadAllDTO, 'orderBy' | 'search' | 'sorting'>;

export type LeadFilter = {
  orderBy: OrderByEnum;
  sorting: Sorting;
  search: string;
  statuses: Array<LeadStatusEnum>;
};
