import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { BaseController, BaseMessageDTO } from '../common/base';
import { TransactionsService } from './transactions.service';
import { Access, AuthGuard, Roles } from '../common/decorators';
import { AccessEnum, AdminRoleEnum } from '../common/enums';
import { AuthUser } from '../auth/decorators';
import { Person } from '../auth/models';
import {
  GetCommissionForTodayResponseDTO,
  GetPendingPayoutAmountResponseDTO,
  TransactionsHistoryForUserResponseDTO,
  TransactionsHistoryResponseDTO
} from './DTO';
import { BalanceResponseDTO, CompoundAmountDTO, OptionalTimeRangeQueryDTO } from '../common/DTO';

@AuthGuard()
@ApiBearerAuth()
@Controller('transactions')
@ApiTags('Transactions')
export class TransactionsController extends BaseController {
  constructor(private readonly transactionsService: TransactionsService) {
    super();
  }

  @ApiOkResponse({ description: 'Returns transactions history', type: [ TransactionsHistoryResponseDTO, ], })
  @Access(AccessEnum.USER)
  @Get('history')
  readHistory(@AuthUser() user: Person, @Query() query: OptionalTimeRangeQueryDTO): Promise<Array<TransactionsHistoryResponseDTO>> {
    return this.transactionsService.getHistory(user, query);
  }

  @ApiOkResponse({ description: 'Returns transactions history', type: [ TransactionsHistoryForUserResponseDTO, ], })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, ])
  @Access(AccessEnum.ADMIN)
  @Get('history/admin')
  readHistoryForAdmin(@AuthUser() person: Person, @Query() query: OptionalTimeRangeQueryDTO): Promise<Array<TransactionsHistoryForUserResponseDTO>> {
    return this.transactionsService.getHistoryForAdmin(person, query);
  }

  @ApiOkResponse({ description: 'Returns amount for paid', type: GetCommissionForTodayResponseDTO, })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, AdminRoleEnum.FINANCIAL, ])
  @Access(AccessEnum.ADMIN)
  @Get('commission-for-today/admin')
  readCommissionForToday(): Promise<GetCommissionForTodayResponseDTO> {
    return this.transactionsService.readCommissionForToday();
  }

  @ApiOkResponse({ description: 'Returns user\'s balance', type: BalanceResponseDTO, })
  @Access(AccessEnum.USER)
  @Get('balance')
  readBalance(@AuthUser() user: Person): Promise<BalanceResponseDTO> {
    return this.transactionsService.getBalance(user.userId);
  }

  @ApiCreatedResponse({ description: 'Returns status of payment request', type: BaseMessageDTO, })
  @Access(AccessEnum.USER)
  @Post('payment-request')
  paymentRequest(@AuthUser() user: Person, @Body() body: CompoundAmountDTO): Promise<BaseMessageDTO> {
    return this.transactionsService.paymentRequest(user.userId, body.amount);
  }

  @ApiOkResponse({ description: 'Returns pending payout amount', type: GetPendingPayoutAmountResponseDTO, })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, ])
  @Access(AccessEnum.ADMIN)
  @Get('total-pending-payout-amount/admin')
  payoutAmount(): Promise<GetPendingPayoutAmountResponseDTO> {
    return this.transactionsService.getPayoutAmount();
  }
}
