import { BadRequestException, ForbiddenException, forwardRef, Inject, Injectable } from '@nestjs/common';

import { TransactionsRepository } from './transactions.repository';
import type { Person } from '../auth/models';
import { UserService } from '../users/user.service';
import type {
  BalanceResponseDTO,
  GetCommissionForTodayResponseDTO,
  GetPendingPayoutAmountResponseDTO,
  TransactionsHistoryForUserResponseDTO,
  TransactionsHistoryResponseDTO
} from './DTO';
import { TransactionsStatusEnum, TransactionsTypeEnum } from '../common/enums';
import type { Transactions } from './transactions.entity';
import type { BaseMessageDTO } from '../common/base';
import { AppConfigService, StripeApiService } from '../common/services';
import type { OptionalTimeRangeQueryDTO, PayoutPendingUsersDTO } from '../common/DTO';
import { encodeBase64 } from '../common/utilities';
import type { StripePayments } from '../stripe/stripe-payments.entity';
import { dateRangeValid } from '../common/validators';
import { StripeService } from '../stripe/stripe.service';
import { CONFIG_PROVIDER_TOKEN } from '../common/services/types';
import type { PendingPayoutAmount } from './common/types';
import type { Sale } from '../sales/sale.entity';
import { percentDenominator } from '../common/constants';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly stripeApiService: StripeApiService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => StripeService))
    private readonly stripeService: StripeService,
    @Inject(CONFIG_PROVIDER_TOKEN)
    private readonly config: AppConfigService
  ) {}

  async getHistory(person: Person, query: OptionalTimeRangeQueryDTO): Promise<Array<TransactionsHistoryResponseDTO>> {
    dateRangeValid(query.startDate, query.endDate);
    await this.userService.readById(person.userId);
    return this.transactionsRepository.getTransactionsHistory(query, person.userId);
  }

  getHistoryForAdmin(person: Person, query: OptionalTimeRangeQueryDTO): Promise<Array<TransactionsHistoryForUserResponseDTO>> {
    dateRangeValid(query.startDate, query.endDate);
    return this.transactionsRepository.getTransactionsHistoryForAdmin(query);
  }

  async readCommissionForToday(): Promise<GetCommissionForTodayResponseDTO> {
    const [ commission, ] = await this.transactionsRepository.getCommissionForToday();
    return { total: commission.amount / percentDenominator, };
  }

  create(transaction: Partial<Transactions>): Promise<Transactions> {
    return this.transactionsRepository.createEntity(transaction);
  }

  async getBalance(userId: number): Promise<BalanceResponseDTO> {
    const balance = await this.transactionsRepository.getBalance(userId);
    return {
      amount: balance.amount,
      currency: 'BRL',
    };
  }

  async paymentRequest(userId: number, invoiceAmount: number): Promise<BaseMessageDTO> {
    const user = await this.userService.getUserWithStripeAccountId(userId);
    const connectAccount = await this.stripeApiService.getConnectedAccount(user.stripeAccountId);
    if (!connectAccount.payouts_enabled) {
      throw new ForbiddenException('Payouts for this user are disabled');
    }
    const currentBalance = await this.getBalance(userId);
    const amount = Math.round(currentBalance.amount * percentDenominator);
    if (amount !== invoiceAmount) {
      throw new BadRequestException('incorrect amount');
    }
    await this.transactionsRepository.createEntity({
      user,
      type: TransactionsTypeEnum.PAY_OUT,
      amount,
      currency: currentBalance.currency,
      status: TransactionsStatusEnum.SUCCESSES,
    });
    return { message: 'Your request has been sent for processing', };
  }

  async getPayoutAmount(paymentIdHash?: string): Promise<GetPendingPayoutAmountResponseDTO> {
    const totalPayoutAmount = await this.readTotalPayoutAmount();
    const minAvailablePayoutAmount = 100;
    if (totalPayoutAmount < minAvailablePayoutAmount) {
      return {
        amount: 0,
        currency: 'BRL',
        usersAmount: 0,
        paymentIdHash: null,
        fee: 0,
        total: 0,
      };
    }
    let paymentId = paymentIdHash;
    const payment = await this.stripeService.getPaymentByStatus(TransactionsStatusEnum.PENDING);
    if (!paymentIdHash) {
      paymentId = encodeBase64(Date.now().toString());
      if (payment) {
        await this.setStripePaymentId({ status: TransactionsStatusEnum.PENDING, }, paymentId, payment.id);
      } else {
        await this.setStripePaymentId({ status: TransactionsStatusEnum.PENDING, }, paymentId);
      }
    }
    const stripePayment = await this.stripeService.getStripePaymentByPaymentId(paymentId);
    const payoutAmount = await this.readPayoutAmount(stripePayment.id, TransactionsStatusEnum.PENDING);

    return {
      amount: parseFloat(((payoutAmount?.amount ?? 0) / percentDenominator).toFixed(2)),
      currency: payoutAmount?.currency ?? 'BRL',
      usersAmount: payoutAmount?.usersAmount ?? 0,
      paymentIdHash: payoutAmount?.paymentIdHash ?? null,
      fee: this.config.stripeConfig.fee,
      total: parseFloat((payoutAmount?.amount / percentDenominator + this.config.stripeConfig.fee).toFixed(2)),
    };
  }

  async getPayoutPendingUsers(): Promise<PayoutPendingUsersDTO> {
    const [ payoutPendingUsers, ] = await this.transactionsRepository.getPayoutPendingUsers();
    return payoutPendingUsers;
  }

  async setStripePaymentId(criteria: unknown, paymentId: string, id?: number): Promise<void> {
    const stripePayment = await this.stripeService.getSetStripePaymentId(paymentId, id);
    await this.transactionsRepository.update(criteria, { stripePayment, });
  }

  async setTransferId(id: number, transferId: string): Promise<void> {
    await this.transactionsRepository.updateEntity(id, { transferId, });
  }

  getByStripePayment(stripePayment: StripePayments): Promise<Array<Transactions>> {
    return this.transactionsRepository.readAllEntities({ where: { stripePayment, }, relations: [ 'user', 'stripePayment', ], });
  }

  async updateStatus(transactionIds: Array<string | number>, status: TransactionsStatusEnum): Promise<void> {
    await this.transactionsRepository.updateFewEntities(transactionIds, { status, });
  }

  async delete(transactionIds: Array<string | number>, status: TransactionsStatusEnum): Promise<void> {
    await this.transactionsRepository.updateFewEntities(transactionIds, { status, });
  }

  async getTransactionIds(stripePayment: StripePayments): Promise<Array<number>> {
    const transactions = await this.transactionsRepository.readAllEntities({ where: { stripePayment, }, });
    return transactions.map(transaction => {
      return transaction.id;
    });
  }

  async readPayoutAmount(stripePaymentId: number, status: TransactionsStatusEnum): Promise<PendingPayoutAmount> {
    const [ payoutAmount, ] = await this.transactionsRepository.getPayoutAmount(stripePaymentId, status);
    return payoutAmount;
  }

  async readTotalPayoutAmount(): Promise<number> {
    const [ payoutAmount, ] = await this.transactionsRepository.getTotalPayoutAmount();
    return payoutAmount.amount;
  }

  async getUserTransactionBySale(sale: Sale): Promise<Transactions> {
    const { amount, ...transaction } = await this.transactionsRepository.readEntity({ where: { sale, isLeader: false, }, });
    return {
      ...transaction,
      amount: amount / percentDenominator,
    };
  }

  async getTransactionsIdBySale(sale: Sale): Promise<Array<number>> {
    const transactions = await this.transactionsRepository.readAllEntities({ where: { sale, type: TransactionsTypeEnum.REFILL, }, });
    return transactions.map(transaction => {
      return transaction.id;
    });
  }
}
