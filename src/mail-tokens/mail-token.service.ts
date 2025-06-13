import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';

import { mailTokenTtl } from '../common/constants/mail-token-ttl';
import { MailTokenRepository } from './mail-token.repository';
import { MailToken } from './mail-token.entity';
import { MailTokenTypeEnum } from '../common/enums';

@Injectable()
export class MailTokenService {
  constructor(
    private readonly mailTokenRepository: MailTokenRepository
  ) {}

  async create(mailTokenEntity: Partial<MailToken>): Promise<MailToken> {
    const mailToken = await this.mailTokenRepository.readEntity({ where: [
      { user: mailTokenEntity.user, },
      { admin: mailTokenEntity.admin, },
      { group: mailTokenEntity.group, },
    ],
    });
    if (mailToken) {
      return this.mailTokenRepository.updateEntity(mailToken.id, { token: uuidv4(), ...mailTokenEntity, });
    }
    return this.mailTokenRepository.createEntity({ token: uuidv4(), ...mailTokenEntity, });
  }

  async activate(token: string, type: MailTokenTypeEnum): Promise<MailToken> {
    const mailTokenEntity = await this.mailTokenRepository.readEntity({
      where: {
        token, type,
      },
      relations: [ 'user', 'admin', 'group', ],
    });
    if (!mailTokenEntity) {
      throw new UnauthorizedException('Invalid token');
    }
    const isTokenExpired = DateTime.fromJSDate(mailTokenEntity.createdAt).diffNow().milliseconds > mailTokenTtl;
    await this.mailTokenRepository.hardDeleteEntity(mailTokenEntity.id);
    switch (type) {
    case MailTokenTypeEnum.PASSWORD_RESET:
    case MailTokenTypeEnum.USER_EMAIL_CONFIRMATION:
      if (!mailTokenEntity.user) {
        throw new UnauthorizedException('Invalid token');
      }
      break;
    case MailTokenTypeEnum.CHANGING_EMAIL:
      if (!mailTokenEntity.user || !mailTokenEntity.newEmail) {
        throw new UnauthorizedException('Invalid token');
      }
      break;
    case MailTokenTypeEnum.ADMIN_EMAIL_CONFIRMATION:
      if (!mailTokenEntity.admin) {
        throw new UnauthorizedException('Invalid token');
      }
      break;
    }
    if (isTokenExpired) {
      throw new UnauthorizedException('Invalid token');
    }

    return mailTokenEntity;
  }
}
