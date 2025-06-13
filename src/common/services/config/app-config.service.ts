import { Injectable, Logger } from '@nestjs/common';

import { validateEnv } from './env-validator';
import {
  DataBaseConfig,
  LogglyConfig,
  MailConfig,
  MediaStorageConfig,
  VimeoConfig,
  FrontendUrlConfig,
  StripeConfig,
  Commission,
  SalesSetting
} from '../types';
import { EnvironmentName, LogLevel, UserLevelEnum } from '../../enums';

@Injectable()
export class AppConfigService {
  private static readonly logger = new Logger(AppConfigService.name);
  private static instance: AppConfigService;

  public environment: EnvironmentName;
  public logLevel: LogLevel;
  public appPort: number;
  public dbConfig: DataBaseConfig;
  public stripeConfig: StripeConfig;
  public jwtSecret: string;
  public jwtExpires: number;
  public logglyConfig: LogglyConfig;
  public apiBaseUrl: string;
  public mailConfig: MailConfig;
  public mediaStorageConfig: MediaStorageConfig;
  public hottok: string;
  public promoLandingUrl: string;
  public registrationUrl: string;
  public frontendUrlConfig: FrontendUrlConfig;
  public vimeoConfig: VimeoConfig;
  public encryptionKey: string;
  public defaultSalePercent: number;
  public commission: Commission;
  public salesSetting: SalesSetting;

  /**
   * Process the NODE_ENV and return right env name
   * @param {string} env
   * @returns {EnvironmentName}
   */
  private static getEnvironment(env?: string): EnvironmentName {
    return env && [ 'dev', 'stage', 'prod', 'local', ].includes(env) ? (env as EnvironmentName) : EnvironmentName.LOCAL;
  }

  /**
   * Init the config. Setup all config values
   */
  public init(): AppConfigService {
    this.environment = AppConfigService.getEnvironment(process.env.NODE_ENV);
    this.apiBaseUrl = this.environment === EnvironmentName.LOCAL ? `http://localhost:${process.env.PORT}/` : process.env.BASE_API_URL;

    validateEnv(this.environment);

    this.jwtSecret = process.env.JWT_SECRET ?? '';
    this.jwtExpires = parseInt(process.env.JWT_EXPIRES ?? '', 10);

    const envPort = parseInt(process.env.PORT ?? '');
    if (envPort) {
      this.appPort = envPort;
    } else {
      AppConfigService.logger.error('application port value is NaN');
    }

    this.dbConfig = {
      username: process.env.DB_USERNAME ?? '',
      password: process.env.DB_PASSWORD ?? '',
      host: process.env.DB_HOST ?? '',
      port: parseInt(process.env.DB_PORT ?? ''),
      name: process.env.DB_NAME ?? '',
    };

    this.logglyConfig = {
      token: process.env.LOGGLY_TOKEN,
      subdomain: process.env.LOGGLY_SUBDOMAIN,
      username: process.env.LOGGLY_USERNAME,
      password: process.env.LOGGLY_PASSWORD,
    };

    this.mailConfig = {
      mailHost: process.env.MAIL_HOST,
      mailPort: parseInt(process.env.MAIL_PORT),
      mailAuthUser: process.env.MAIL_AUTH_USER,
      mailAuthPass: process.env.MAIL_AUTH_PASS,
      mailRecipient: process.env.MAIL_RECIPIENT,
    };

    this.mediaStorageConfig = {
      endpoint: process.env.S3_AWS_URL,
      secretAccessKey: process.env.S3_SECRET_KEY,
      accessKeyId: process.env.S3_ACCESS_KEY,
      bucketImageName: process.env.BUCKET_IMAGE_NAME,
    };

    this.encryptionKey = process.env.ENCRYPTION_KEY;

    this.hottok = process.env.HOTTOK;

    this.promoLandingUrl = process.env.PROMO_LANDING_URL;
    this.registrationUrl = process.env.REGISTRATION_URL;

    this.frontendUrlConfig = {
      setPasswordUrl: process.env.BASE_FRONTEND_URL + process.env.SET_PASSWORD_URL,
      resetPasswordUrl: process.env.BASE_FRONTEND_URL + process.env.RESET_PASSWORD_URL,
      groupInvitationUrl: process.env.BASE_FRONTEND_URL + process.env.GROUP_INVITATION_URL,
      changeEmailUrl: process.env.BASE_FRONTEND_URL + process.env.CHANGE_EMAIL_URL,
      confirmChangeEmailUrl: process.env.BASE_FRONTEND_URL + process.env.CONFIRM_CHANGE_EMAIL_URL,
      groupLink: process.env.BASE_FRONTEND_URL + process.env.GROUP_BASE_URL,
      baseFrontendUrl: process.env.BASE_FRONTEND_URL,
    };

    this.vimeoConfig = {
      clientId: process.env.VIMEO_CLIENT_ID,
      clientSecret: process.env.VIMEO_CLIENT_SECRET,
      accessToken: process.env.VIMEO_ACCESS_TOKEN,
    };

    this.stripeConfig = {
      stripeSk: process.env.STRIPE_SK,
      stripePk: process.env.STRIPE_PK,
      loginLink: 'https://dashboard.stripe.com/login',
      refreshUrl: process.env.STRIPE_REFRESH_URL,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      fee: parseFloat(process.env.STRIPE_FEE),
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    };

    this.defaultSalePercent = parseInt(process.env.DEFAULT_SALE_PERCENT, 10);
    this.commission = {
      standardPrice:  parseInt(process.env.STANDARD_PRICE, 10),
      discountPrice:  parseInt(process.env.DISCOUNT_PRICE, 10),
    };

    this.salesSetting = {
      levelStarThreshold: {
        [UserLevelEnum.GOAL_GETTER_I]: {
          stars: 3,
          starPrice: 4,
          timeLimit: null,
          direct: 10, //individual commission
          indirect: 0, //group commission
        },
        [UserLevelEnum.GOAL_GETTER_II]: {
          stars: 8,
          starPrice: 6,
          timeLimit: 12,
          direct: 13,
          indirect: 0,
        },
        [UserLevelEnum.LEADER_I]: {
          stars: 3,
          starPrice: 16,
          timeLimit: null,
          direct: 15,
          indirect: 2,
        },
        [UserLevelEnum.LEADER_II]: {
          stars: 5,
          starPrice: 30,
          timeLimit: 8,
          direct: 15,
          indirect: 3,
        },
        [UserLevelEnum.TRUE_LEADER_I]: {
          stars: 3,
          starPrice: 80,
          timeLimit: null,
          direct: 16,
          indirect: 4,
        },
        [UserLevelEnum.TRUE_LEADER_II]: {
          stars: 5,
          starPrice: 120,
          timeLimit: 8,
          direct: 16,
          indirect: 5,
        },
        [UserLevelEnum.MASTER]: {
          stars: 6,
          starPrice: 200,
          timeLimit: 6,
          direct: 18,
          indirect: 10,
        },
        [UserLevelEnum.ULTIMATE_CHALLENGE]: {
          stars: 0,
          starPrice: 0,
          timeLimit: null,
          direct: 18,
          indirect: 10,
        },
      },
      maxLevel: 7,
      firstLevel: {
        stars: 0,
        level: UserLevelEnum.GOAL_GETTER_I,
        levelTitle: 'GOAL_GETTER_I',
        salesToNextLevel: 12,
      },
    };

    return this;
  }

  static getConfig(): AppConfigService {
    if (!AppConfigService.instance) {
      AppConfigService.instance = new AppConfigService();
    }
    AppConfigService.instance.init();
    return AppConfigService.instance;
  }
}
