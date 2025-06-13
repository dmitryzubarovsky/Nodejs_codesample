import { GetAllDocumentsDTO } from '../DTO';
import { OrderByEnum, Sorting, UsersDocumentsStatus } from '../../common/enums';

export type DocumentsQueryStatuses = Omit<GetAllDocumentsDTO, 'orderBy' | 'search' | 'sorting'>;

export type DocumentsFilter = {
  orderBy: OrderByEnum;
  sorting: Sorting;
  search: string;
  statuses: Array<UsersDocumentsStatus>;
};
