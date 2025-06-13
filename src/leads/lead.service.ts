import { Not } from 'typeorm';
import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common';

import { LeadRepository } from './lead.repository';
import type { Person } from '../auth/models';
import type { CreateLeadDTO, LeadAllResponseDTO, LeadResponseDTO, ReadLeadAllDTO } from './DTO';
import type { Lead } from './lead.entity';
import type { BaseMessageDTO } from '../common/base';
import { UserService } from '../users/user.service';
import { LeadStatusEnum } from '../common/enums';
import type { QueryStatusesDTO } from './common/types';

@Injectable()
export class LeadService {
  constructor(
    private readonly leadRepository: LeadRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {}

  async create(person: Person, body: CreateLeadDTO): Promise<LeadResponseDTO> {
    const user = await this.userService.readById(person.userId);
    const recordIsExist = !!await this.leadRepository.readEntity({
      where: {
        user,
        phoneNumber: body.phoneNumber,
      },
    });
    if (recordIsExist) {
      throw new BadRequestException('Lead with this phone already exists');
    }
    return this.leadRepository.createEntity({ user, ...body, });
  }

  readAll(query: ReadLeadAllDTO, user?: Person): Promise<Array<LeadAllResponseDTO>> {
    const { orderBy, search, sorting, ...queryStatuses } = query;
    const statuses = this.getLeadStatuses(queryStatuses);
    const options = { orderBy, search, sorting, statuses, };
    return this.leadRepository.readAll(options, user?.userId);
  }

  async update(person: Person, id: number, body: CreateLeadDTO): Promise<LeadResponseDTO> {
    const user = await this.userService.readById(person.userId);
    const lead = await this.readById(id, [ 'user', ]);
    if (lead.user.id !== person.userId) {
      throw new ForbiddenException('Access is unavailable');
    }
    const recordIsExist = !!await this.leadRepository.readEntity({
      where: {
        user,
        phoneNumber: body.phoneNumber,
        id: Not(id),
      },
    });
    if (recordIsExist) {
      throw new BadRequestException('Lead with this phone already exists');
    }
    return this.leadRepository.updateEntity(id, body);
  }

  async delete(user: Person, id: number): Promise<BaseMessageDTO> {
    const lead = await this.readById(id, [ 'user', ]);
    if (lead.user.id !== user.userId) {
      throw new ForbiddenException('Access is unavailable');
    }
    await this.leadRepository.softDeleteEntity(id);
    return { message: 'Lead was successfully deleted', };
  }

  async readById(id: number, relations?: Array<string>): Promise<Lead> {
    const lead = await this.leadRepository.readEntityById(id, { relations, });
    if (!lead) {
      throw new NotFoundException('The entity with this id was not found');
    }
    return lead;
  }

  private getLeadStatuses(queryStatuses: QueryStatusesDTO): Array<LeadStatusEnum> {
    type LeadStatus = keyof QueryStatusesDTO;
    const statusMap: Record<LeadStatus, LeadStatusEnum> = {
      contactedStatus: LeadStatusEnum.CONTACTED,
      inNegotiationsStatus: LeadStatusEnum.IN_NEGOTIATIONS,
      postponedStatus: LeadStatusEnum.POSTPONED,
      linkSentStatus: LeadStatusEnum.LINK_SENT,
      soldStatus: LeadStatusEnum.SOLD,
      lostStatus: LeadStatusEnum.LOST,
      newLeadStatus: LeadStatusEnum.NEW_LEAD,
    };
    return Object.keys(queryStatuses)
      .filter((status: LeadStatus) => queryStatuses[status] === true)
      .map((status: LeadStatus) => statusMap[status]);
  }
}
