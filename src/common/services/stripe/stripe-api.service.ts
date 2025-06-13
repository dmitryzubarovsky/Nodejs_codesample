import { Inject } from '@nestjs/common';
import { Stripe } from 'stripe';
import { DateTime } from 'luxon';

import { getCountryValue, getStateValue } from '../../utilities';
import { CONFIG_PROVIDER_TOKEN } from '../types';
import { AppConfigService } from '../config/app-config.service';
import { User } from '../../../users/user.entity';
import { LoggerService } from '../logger/loger.service';
import { BalanceResponseDTO } from '../../DTO';

export class StripeApiService {
  private readonly stripeClient: Stripe;

  constructor(
    @Inject(CONFIG_PROVIDER_TOKEN)
    private readonly configService: AppConfigService,
    private readonly logger: LoggerService
  ) {
    this.stripeClient = new Stripe(this.configService.stripeConfig.stripeSk, { apiVersion: null, });
  }

  async getBalance(stripeAccount?: string): Promise<BalanceResponseDTO> {
    const options = { stripeAccount, };
    const balanceObject = await this.stripeClient.balance.retrieve(null, options);
    const [ availableBalance, ] = balanceObject.available;
    const [ pendingBalance, ] = balanceObject.pending;
    const available = availableBalance.amount / 100;
    const pending = pendingBalance.amount / 100;
    return {
      amount: available + pending,
      currency: 'BRL',
    };
  }

  registration(user: User): Promise<Stripe.Response<Stripe.Account>> {
    const [ firstName, ...name ] = user.fullName.split(' ');
    const individual = {
      address: {
        city: user.city ?? '',
        country: user.countryId ? getCountryValue(user.countryId).code : null,
        line1: `${user.district ?? ''} ${user.street ?? ''} ${user.house ?? ''} ${user.apartment ?? ''}`,
        line2: ` ${user.house ?? ''} ${user.apartment ?? ''}`,
        state: user.stateId ? getStateValue(user.stateId).name : null,
      },
      dob: user.birthDate ? {
        day: DateTime.fromJSDate(user.birthDate).day,
        month: DateTime.fromJSDate(user.birthDate).month,
        year: DateTime.fromJSDate(user.birthDate).year,
      } : null,
      email: user.email,
      first_name: firstName,
      last_name: name.pop(),
      id_number: user.cpf,
      phone: user.phoneNumber,
    };

    return this.stripeClient.accounts.create({
      type: 'express',
      country: 'BR',
      email: user.email,
      capabilities: {
        card_payments: { requested: true, },
        transfers: { requested: true, },
      },
      business_type: 'individual',
      business_profile: {
        url: this.configService.frontendUrlConfig.baseFrontendUrl,
      },
      individual,
    });
  }

  createOnBoardingLink(stripeAccountId: string): Promise<Stripe.Response<Stripe.AccountLink>> {
    return this.stripeClient.accountLinks.create({
      account: stripeAccountId,
      refresh_url: this.configService.stripeConfig.refreshUrl,
      return_url: this.configService.frontendUrlConfig.baseFrontendUrl,
      type: 'account_onboarding',
    });
  }

  createLoginLink(stripeAccountId: string): Promise<Stripe.Response<Stripe.LoginLink>> {
    return this.stripeClient.accounts.createLoginLink(
      stripeAccountId
    );
  }

  getConnectedAccount(stripeAccountId: string): Promise<Stripe.Response<Stripe.Account>> {
    return this.stripeClient.accounts.retrieve(stripeAccountId);
  }

  createStripePayment(amount: number, internalStripePaymentId: number): Promise<Stripe.Checkout.Session> {
    try {
      return this.stripeClient.checkout.sessions.create({
        payment_method_types: [ 'boleto', ],

        line_items: [ {
          price_data: {
            currency: 'brl',
            product_data: {
              name: `Payment id: ${internalStripePaymentId}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        }, ],
        mode: 'payment',
        success_url:  this.configService.frontendUrlConfig.baseFrontendUrl,
        cancel_url:  this.configService.frontendUrlConfig.baseFrontendUrl,
        metadata: {
          internalStripePaymentId,
        },
      }
      );
    } catch (e) {
      this.logger.warn(`Payment for internal stripe payment id: ${internalStripePaymentId} failed; Error: ${e}`);
      return;
    }
  }

  getPaymentIntent(paymentId: string): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    return this.stripeClient.paymentIntents.retrieve(paymentId);
  }

  async transfers(stripeAccountId: string, chargeId: string, amount: number, transactionId: number): Promise<Stripe.Response<Stripe.Transfer>> {
    try {
      return await this.stripeClient.transfers.create({
        amount,
        currency: 'brl',
        source_transaction: chargeId,
        destination: stripeAccountId,
        metadata: { transactionId, },
      });
    } catch (e) {
      this.logger.warn(`Transfers for ${stripeAccountId} failed; Error: ${e}`);
      return;
    }
  }

  async checkWebhookSignature(body: string | Buffer, signature: string | Buffer | Array<string>): Promise<Stripe.Event> {
    try {
      return await this.stripeClient.webhooks.constructEvent(
        body,
        signature,
        this.configService.stripeConfig.webhookSecret
      );
    } catch (err) {
      this.logger.warn('Webhook signature verification failed.');
      return;
    }
  }
}
