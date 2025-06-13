import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createTransport } from 'nodemailer';
import { compile } from 'handlebars';

import { AppConfigService } from '../common/services';
import type { BaseMessageDTO } from '../common/base';
import { CONFIG_PROVIDER_TOKEN } from '../common/services/types';
import { UserService } from '../users/user.service';
import { EmailTypeEnum } from '../common/enums';
import { GlossaryService } from '../glossaries/glossary.service';
import { UserRepository } from '../users/user.repository';
import { queries, subjects, emails } from './common/constants';
import type { SendEmail } from './common/types';

@Injectable()
export class MailService {
  private readonly transporter;

  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => GlossaryService))
    private readonly glossaryService: GlossaryService,
    @Inject(CONFIG_PROVIDER_TOKEN)
    private readonly config: AppConfigService
  ) {
    this.transporter = createTransport({
      host: this.config.mailConfig.mailHost,
      port: this.config.mailConfig.mailPort,
      auth: {
        user: this.config.mailConfig.mailAuthUser,
        pass: this.config.mailConfig.mailAuthPass,
      },
      authMethod: 'LOGIN',
    });
  }

  async sendEmail(body: SendEmail): Promise<BaseMessageDTO> {
    const template = emails[body.type];
    const data = await this.getHandlebars(body.type, body.handlebars, body.mailToken);
    const subject = subjects[body.type];
    await this.transporter.sendMail({
      from: this.config.mailConfig.mailRecipient,
      to: body.email,
      html: compile(template)(data),
      subject,
    });
    return { message: 'Email was sent successfully.', };
  }

  private async getHandlebars(type: EmailTypeEnum, commonProperties: Array<string | number>, mailToken?: string): Promise<unknown> {
    const query = queries[type];
    const [ handlebars, ] = await this.userRepository.query(query, commonProperties);
    switch (type) {
    case EmailTypeEnum.ADMIN_CONFIRM_EMAIL:
      handlebars.adminConfirmEmail = `${this.config.frontendUrlConfig.confirmChangeEmailUrl}${mailToken}`;
      break;
    case EmailTypeEnum.CHANGE_EMAIL:
      handlebars.changeEmail = `${this.config.frontendUrlConfig.changeEmailUrl}${mailToken}`;
      break;
    case EmailTypeEnum.CONFIRM_EMAIL:
      handlebars.confirmEmail = `${this.config.frontendUrlConfig.confirmChangeEmailUrl}${mailToken}`;
      break;
    case EmailTypeEnum.FORGOT_PASSWORD:
      handlebars.forgotPassword = `${this.config.frontendUrlConfig.resetPasswordUrl}${mailToken}`;
      break;
    case EmailTypeEnum.INVITE:
      handlebars.invite = `${this.config.frontendUrlConfig.groupLink}/${commonProperties[1]}`; //groupId
      break;
    case EmailTypeEnum.REGISTRATION:
      handlebars.registration = `${this.config.frontendUrlConfig.setPasswordUrl}${mailToken}`;
      break;
    case EmailTypeEnum.ADD_GROUP_MEMBER:
      handlebars.groupLink = `${this.config.frontendUrlConfig.groupLink}/${commonProperties[1]}`; //groupId
    }

    return this.replaceNullableFields(handlebars);
  }

  private replaceNullableFields(object: Record<string, string>): object {
    Object.keys(object).forEach(key => {
      object[key] = object[key] ?? '';
    });
    return object;
  }
}
