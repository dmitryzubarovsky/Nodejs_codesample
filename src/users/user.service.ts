import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { Between, In, IsNull, Not } from 'typeorm';

import {
  compareHashPassword,
  decodeBase64,
  encodeBase64,
  generatePasswordHash,
  getCurrentDateRange,
  getLastDateRange
} from '../common/utilities';
import type { BaseMessageDTO } from '../common/base';
import { ImageService } from '../images/image.service';
import { MailService } from '../mail/mail.service';
import { UserRepository } from './user.repository';
import type { Person } from '../auth/models';
import {
  DateUnitEnum,
  EmailTypeEnum,
  MailTokenTypeEnum,
  StorageContainerEnum,
  UserLevelEnum,
  UsersDocumentsStatus,
  WeekEnum
} from '../common/enums';
import type { User } from './user.entity';
import type {
  AddressResponseDTO,
  GetUsersWithoutGroupDTO,
  GrouplessMembersResponseDTO,
  LinkResponseDTO,
  PendingUsersResponseDTO,
  PersonalDataResponseDTO,
  ReadAllUserDTO,
  ReadUserResponseDTO,
  RegisterDTO,
  SetPasswordDTO,
  UpdateAddressDTO,
  UpdateAddressResponseDTO,
  UpdatePersonalDataDTO,
  UpdateProfileDTO,
  UpdateProfileResponseDTO,
  UserProfileResponseDTO,
  UserRatingResponseDTO
} from './DTO';
import type {
  ChangePasswordDTO,
  PayoutPendingUsersDTO,
  RatingQueryDTO,
  StaticsResponseDTO,
  TotalResponseDTO
} from '../common/DTO';

import { fullDate, ratingLimit, yearMonthDate } from '../common/constants';
import { GroupUsersService } from '../group-users/group-users.service';
import { AppConfigService, LoggerService, StripeApiService } from '../common/services';
import { SaleService } from '../sales/sale.service';
import { CONFIG_PROVIDER_TOKEN } from '../common/services/types';
import { SettingsService } from '../settings/settings.service';
import { FileService } from '../files/file.service';
import { TransactionsService } from '../transactions/transactions.service';
import { MailTokenService } from 'src/mail-tokens/mail-token.service';
import { UserDocumentService } from '../user-documents/user-document.service';
import { v4 as uuidv4 } from 'uuid';
import { ConflictException } from '@nestjs/common/exceptions/conflict.exception';
import type { ReferCode } from './common/types';
import type { UserRating } from '../common/types/user-rating.type';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(forwardRef(() => ImageService))
    private readonly imageService: ImageService,
    @Inject(forwardRef(() => MailService))
    private readonly mailService: MailService,
    @Inject(forwardRef(() => GroupUsersService))
    private readonly groupUsersService: GroupUsersService,
    @Inject(forwardRef(() => SaleService))
    private readonly saleService: SaleService,
    @Inject(forwardRef(() => SettingsService))
    private readonly settingsService: SettingsService,
    @Inject(forwardRef(() => FileService))
    private readonly fileService: FileService,
    @Inject(forwardRef(() => TransactionsService))
    private readonly transactionsService: TransactionsService,
    @Inject(forwardRef(() => StripeApiService))
    private readonly stripeApiService: StripeApiService,
    @Inject(forwardRef(() => MailTokenService))
    private readonly mailTokenService: MailTokenService,
    @Inject(forwardRef(() => UserDocumentService))
    private readonly usersDocumentsService: UserDocumentService,
    private readonly logger: LoggerService,
    @Inject(CONFIG_PROVIDER_TOKEN)
    private readonly config: AppConfigService
  ) {}

  async register(body: RegisterDTO): Promise<BaseMessageDTO> {
    let refer = null;
    const { referCode, phoneNumber, } = body;

    if (body.countryId === 1 && !body.stateId) {
      throw new BadRequestException('stateId must be not empty');
    }

    const { registrationStatus, } = await this.settingsService.readRegistrationStatus();
    if (!registrationStatus) {
      throw new ForbiddenException('Registration is currently unavailable');
    }

    const isExists = !! await this.userRepository.readEntity({
      where: [
        { email: body.email, },
        { phoneNumber, },
      ],
    });
    if (isExists) {
      throw new BadRequestException('User with this email or phone already exists');
    }

    if (referCode) {
      const { userId, } = decodeBase64<ReferCode>(referCode, 'referCode');
      refer = await this.readById(userId);
      if (!refer.confirmedAt) {
        throw new ForbiddenException('Refer is not confirmed');
      }
    }

    await this.userRepository.createEntity({
      refer,
      phoneNumber: body.phoneNumber,
      fullName: body.fullName,
      email: body.email,
      countryId: body.countryId,
      stateId: body.stateId,
      city: body.city,
      nickname: body.fullName,
      uniqKey: uuidv4(),
    });

    return { message: 'The user has successfully registered', };
  }

  async setPassword(body: SetPasswordDTO): Promise<BaseMessageDTO> {
    const mailToken = await this.mailTokenService.activate(body.token, MailTokenTypeEnum.PASSWORD_RESET);
    const user = await this.readById(mailToken.user.id);
    await this.userRepository.updateEntity(user.id, {
      password: await generatePasswordHash(body.password),
    });
    return { message: 'Password is set successfully', };
  }

  async changePassword(person: Person, body: ChangePasswordDTO): Promise<BaseMessageDTO> {
    const user = await this.userRepository.readEntityById(person.userId, {
      select: [ 'id', 'password', ],
    });

    if (!user) {
      throw new NotFoundException('User with this id was not found');
    }

    if (!await compareHashPassword(body.currentPassword, user.password)) {
      throw new ForbiddenException('Invalid current password');
    }
    if (await compareHashPassword(body.newPassword, user.password)) {
      throw new BadRequestException('The new password must be different from the current');
    }
    await this.userRepository.updateEntity(user.id, {
      password: await generatePasswordHash(body.newPassword),
    });
    return { message: 'Password changed successfully', };
  }

  async changePhoneNumber(person: Person, phoneNumber: string): Promise<BaseMessageDTO> {
    const isExist = await this.userRepository.readEntity({
      where: { phoneNumber, },
    });
    if (isExist) {
      throw new BadRequestException('The new phone number already exists');
    }

    const user = await this.readById(person.userId);
    if (await compareHashPassword(phoneNumber, user.phoneNumber)) {
      throw new BadRequestException('The new phone number must be different from the current');
    }
    await this.userRepository.updateEntity(user.id, { phoneNumber, });
    return { message: 'Phone number changed successfully', };
  }

  async confirmChangeEmail(person: Person): Promise<BaseMessageDTO> {
    const user = await this.readById(person.userId);
    const mailToken = await this.mailTokenService.create({ type: MailTokenTypeEnum.USER_EMAIL_CONFIRMATION, user, });
    await this.mailService.sendEmail({
      handlebars: [ person.userId, ],
      type: EmailTypeEnum.CONFIRM_EMAIL,
      email: user.email,
      mailToken: mailToken.token,
    });
    return {
      message: `The link to confirm the change of mail was successfully sent to a ${user.email}`,
    };
  }

  async confirmNewEmail(token: string, email: string): Promise<BaseMessageDTO> {
    if (await this.readByEmail(email)) {
      throw new BadRequestException('User with this email already exists');
    }
    const decodedMailToken = await this.mailTokenService.activate(token, MailTokenTypeEnum.USER_EMAIL_CONFIRMATION);
    const mailToken = await this.mailTokenService.create({ type: MailTokenTypeEnum.CHANGING_EMAIL, newEmail: email, user: decodedMailToken.user, });
    await this.mailService.sendEmail({
      handlebars: [ decodedMailToken.user.id, email, ],
      type: EmailTypeEnum.CHANGE_EMAIL,
      email,
      mailToken: mailToken.token,
    });
    return {
      message: `The link to confirm the change of mail was successfully sent to ${email}`,
    };
  }

  async setEmail(token: string): Promise<BaseMessageDTO> {
    const mailToken = await this.mailTokenService.activate(token, MailTokenTypeEnum.CHANGING_EMAIL);
    await this.userRepository.updateEntity(mailToken.user.id, { email: mailToken.newEmail, });
    return { message: 'Email changed successfully', };
  }

  async forgotPassword(email: string): Promise<BaseMessageDTO> {
    const user = await this.readByEmail(email);
    if (!user) {
      return { message: 'Email was sent successfully.', };
    }
    const mailToken = await this.mailTokenService.create({ type: MailTokenTypeEnum.PASSWORD_RESET, user, });
    return this.mailService.sendEmail({
      handlebars: [ user.id, ],
      type: EmailTypeEnum.FORGOT_PASSWORD,
      email,
      mailToken: mailToken.token,
    });
  }

  async readAll(query: ReadAllUserDTO): Promise<Array<ReadUserResponseDTO>> {
    const users = await this.userRepository.getAllUsers(query);
    const usersIds = users.map((item) => item.id);
    const userLevels = await this.saleService.getUserLevelWithoutSalesToNextLevel(usersIds);
    return users.map((item) => {
      const levelData = userLevels.find((lvl) => lvl.id === item.id);
      return { ...item, ...levelData, };
    });
  }

  async readPendingUsers(): Promise<Array<PendingUsersResponseDTO>> {
    const users = await this.userRepository.readAllEntities({
      select: [
        'id', 'createdAt', 'updatedAt',
        'deletedAt', 'fullName', 'email',
        'phoneNumber', 'countryId', 'stateId', 'city',
      ],
      where: {
        confirmedAt: null,
      },
      relations: [ 'refer', ],
      order: { createdAt: 'DESC', },
    });
    return users.map(userFromDb => {
      const { refer, ...user } = userFromDb;
      delete user.complaints;
      return {
        ...user,
        refer: refer ? {
          id: refer.id,
          nickname: refer.nickname,
        } : null,
      };
    });
  }

  async approveRegistration(id: number): Promise<BaseMessageDTO> {
    const user = await this.getUnapprovedUser(id);
    const mailToken = await this.mailTokenService.create({ type: MailTokenTypeEnum.PASSWORD_RESET, user, });
    try {
      const sendEmail = await this.mailService.sendEmail({
        type: EmailTypeEnum.REGISTRATION,
        email: user.email,
        handlebars: [ id, ],
        mailToken: mailToken.token,
      });
      this.logger.log(`Send email status:${JSON.stringify(sendEmail)}`);
    } catch (e) {
      throw new ConflictException('Email dont send ');
    }
    await this.userRepository.confirmUser(user.id);
    return { message: 'User registration has been approved', };
  }

  async lockOrUnlock(id: number, locked: boolean): Promise<BaseMessageDTO> {
    await this.readById(id);
    await this.userRepository.updateEntity(id, {
      lockedAt: locked ? new Date() : null,
    });
    if (locked) {
      return { message: 'User was successfully locked', };
    }
    return { message: 'User was successfully unlocked', };
  }

  async reject(id: number): Promise<BaseMessageDTO> {
    await this.getUnapprovedUser(id);
    await this.userRepository.softDeleteEntity(id);
    return { message: 'User registration has been rejected', };
  }

  async readRatingTop(person: Person, week: WeekEnum): Promise<Array<UserRatingResponseDTO>> {
    const date = week === WeekEnum.CURRENT ?
      getCurrentDateRange(DateUnitEnum.WEEK) :
      getLastDateRange(DateUnitEnum.WEEK);
    const ratingFromDB = await this.userRepository
      .getUserSalesRatingTop(date, ratingLimit, person.userId);
    return this.saleService.addUserLevel<UserRating>('id', ratingFromDB);
  }

  async readRatingAll(query: RatingQueryDTO): Promise<Array<UserRatingResponseDTO>> {
    if (query.salesFrom > query.salesTo) {
      throw new BadRequestException('salesTo must be greater than salesFrom');
    }
    const ratingFromDB = await this.userRepository.getUsersSalesRating(query);
    return this.saleService.addUserLevel<UserRating>('id', ratingFromDB);
  }

  async readUsersWithoutGroup(person: Person, query: GetUsersWithoutGroupDTO): Promise<Array<GrouplessMembersResponseDTO>> {
    const { search, ...levels } = query;
    const usersWithoutGroup = await this.userRepository.getUsersWithoutGroup(person.adminGroupId, search);
    const usersWithoutGroupWithLevel = await this.saleService.addUserLevel('id', usersWithoutGroup);
    const userLevels = this.getUserLevels(levels);
    return usersWithoutGroupWithLevel.filter((users) =>
      userLevels.includes(users.level)
    );
  }

  async readUsersWithoutGroupByAdmin(person: Person, query: GetUsersWithoutGroupDTO): Promise<Array<GrouplessMembersResponseDTO>> {
    const { search, ...levels } = query;
    const usersWithoutGroup = await this.userRepository.getUsersWithoutGroupByAdmin(search);
    const usersWithoutGroupWithLevel = await this.saleService.addUserLevel('id', usersWithoutGroup);
    const userLevels = this.getUserLevels(levels);
    return usersWithoutGroupWithLevel.filter((users) =>
      userLevels.includes(users.level)
    );
  }

  async readProfile(id: number): Promise<UserProfileResponseDTO> {
    const user = await this.userRepository.readEntityById(id);
    if (!user) {
      throw new BadRequestException('User with this id not found');
    }
    const invoicingPermissions = await this.usersDocumentsService.getInvoicingPermissions(user);
    const document = await this.usersDocumentsService.getDocumentByUser(user);
    const [ userLevel, ] = await this.saleService.getUserLevelWithoutSalesToNextLevel([ user.id, ]);
    const profile: UserProfileResponseDTO = {
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
      nickname: user.nickname,
      avatarImageId: user?.avatarImageId,
      groupId: null,
      groupAvatarImageId: null,
      countryId: user.countryId,
      stateId: user.stateId,
      city: user.city,
      about: user.about,
      invoicingPermissions: invoicingPermissions,
      documentId: document ? document.id : null,
      documentStatus: document ? document.status : UsersDocumentsStatus.NOT_LOAD,
      ...userLevel,
    };
    const groupUsers= await this.groupUsersService.getGroupUsersByUserId(user.id);
    profile.groupId = groupUsers?.groupMember?.group.id ?? null;
    profile.groupAvatarImageId = groupUsers?.groupMember?.group.avatarImageId ?? null;

    return profile;
  }

  async readPersonalData(id: number): Promise<PersonalDataResponseDTO> {
    const personalData = await this.readById(id, undefined, [ 'id', 'profession', 'birthDate', 'about', ]);
    delete personalData.complaints;
    return personalData;
  }

  async readAddress(id: number): Promise<AddressResponseDTO> {
    const addressData = await this.readById(id, undefined, [
      'id', 'zip', 'countryId', 'stateId', 'city', 'district', 'street', 'house', 'apartment',
    ]);
    delete addressData.complaints;
    return addressData;
  }

  async updateProfile(id: number, body: UpdateProfileDTO): Promise<UpdateProfileResponseDTO> {
    const avatar = body.avatarImageId ?
      await this.imageService.readImageById(
        body.avatarImageId,
        StorageContainerEnum.USER_AVATAR
      ) : null;
    const updatedUser = await this.userRepository.updateEntity(id, {
      nickname: body.nickname,
      avatar,
    });
    return {
      id: updatedUser.id,
      nickname: updatedUser.nickname,
      avatarImageId: avatar?.id ?? null,
    };
  }

  async updatePersonalData(id: number, body: UpdatePersonalDataDTO): Promise<PersonalDataResponseDTO> {
    const updatedUser = await this.userRepository.updateEntity(id, body);
    return {
      id: updatedUser.id,
      profession: updatedUser.profession,
      birthDate: updatedUser.birthDate,
      about: updatedUser.about,
    };
  }

  async updateAddress(id: number, body: UpdateAddressDTO): Promise<UpdateAddressResponseDTO> {
    const updatedUser = await this.userRepository.updateEntity(id, body);
    return {
      id: updatedUser.id,
      zip: updatedUser.zip,
      countryId: updatedUser.countryId,
      stateId: updatedUser.stateId,
      city: updatedUser.city,
      district: updatedUser.district,
      street: updatedUser.street,
      house: updatedUser.house,
      apartment: updatedUser.apartment,
    };
  }

  async getNumberOfNewUsers(): Promise<StaticsResponseDTO> {
    const weekResult = await this.userRepository.getNumberOfNewUsers(
      getCurrentDateRange(DateUnitEnum.WEEK),
      DateUnitEnum.DAY,
      fullDate
    );
    const monthResult = await this.userRepository.getNumberOfNewUsers(
      getCurrentDateRange(DateUnitEnum.MONTH),
      DateUnitEnum.DAY,
      fullDate
    );
    const yearResult = await this.userRepository.getNumberOfNewUsers(
      getCurrentDateRange(DateUnitEnum.YEAR),
      DateUnitEnum.MONTH,
      yearMonthDate
    );
    return {
      week: weekResult.map(value => value.numberOfNewUsers),
      month: monthResult.map(value => value.numberOfNewUsers),
      year: yearResult.map(value => value.numberOfNewUsers),
    };
  }

  async getNumberOfNewUsersToday(): Promise<TotalResponseDTO> {
    const day = getCurrentDateRange(DateUnitEnum.DAY);
    const total = await this.userRepository.count({
      where: { confirmedAt: Between(day.startDate, day.endDate), },
    });
    return { total, };
  }

  async getNumberOfRegistrationRequest(): Promise<StaticsResponseDTO> {
    const weekResult = await this.userRepository.getNumberOfRegistrationRequest(
      getCurrentDateRange(DateUnitEnum.WEEK),
      DateUnitEnum.DAY,
      fullDate
    );
    const monthResult = await this.userRepository.getNumberOfRegistrationRequest(
      getCurrentDateRange(DateUnitEnum.MONTH),
      DateUnitEnum.DAY,
      fullDate
    );
    const yearResult = await this.userRepository.getNumberOfRegistrationRequest(
      getCurrentDateRange(DateUnitEnum.YEAR),
      DateUnitEnum.MONTH,
      yearMonthDate
    );
    return {
      week: weekResult.map(value => value.numberOfRegistrationRequest),
      month: monthResult.map(value => value.numberOfRegistrationRequest),
      year: yearResult.map(value => value.numberOfRegistrationRequest),
    };
  }

  async getNumberOfRegistrationRequestToday(): Promise<TotalResponseDTO> {
    const day = getCurrentDateRange(DateUnitEnum.DAY);
    const total = await this.userRepository.count({
      where: { createdAt: Between(day.startDate, day.endDate), },
    });
    return { total, };
  }

  async getNumberOfRegisteredUsers(): Promise<TotalResponseDTO> {
    const total = await this.userRepository.count({ confirmedAt: Not(IsNull()), });
    return { total, };
  }

  getPayoutPendingUsers(): Promise<PayoutPendingUsersDTO> {
    return this.transactionsService.getPayoutPendingUsers();
  }

  async getReferralLink(id: number): Promise<LinkResponseDTO> {
    const user = await this.readById(id, [], [ 'uniqKey', ]);
    const referralCode = encodeBase64(JSON.stringify({ key: user.uniqKey, }));
    const link = this.config.promoLandingUrl + referralCode;
    return { link, };
  }

  getRegistrationLink(id: number): LinkResponseDTO {
    const referralCode = encodeBase64(JSON.stringify({ userId: id, }));
    const link = this.config.registrationUrl + referralCode;
    return { link, };
  }

  async readById(id: number | string, relations?: Array<string>, select?: Array<keyof User>): Promise<User> {
    const user = await this.userRepository.readEntityById(id, { relations, select, });
    if (!user) {
      throw new NotFoundException('User with this id was not found');
    }
    return user;
  }

  deleteAvatar(user: User): Promise<User> {
    user.avatar = null;
    return this.userRepository.save(user);
  }

  readByIdWithoutException(id: number): Promise<User> {
    return this.userRepository.readEntityById(id);
  }

  async setStripeAccountId(userId: number, stripeAccountId: string): Promise<void> {
    await this.userRepository.updateEntity(userId, { stripeAccountId, } );
  }

  async readByEmail(email: string, exception?: boolean): Promise<User> {
    const user = await this.userRepository.readEntity({
      where: { email, },
      select: [ 'id', 'password', 'lockedAt', 'confirmedAt', ],
    });
    if (!user) {
      if (exception) {
        throw new NotFoundException('User not found');
      }
      return null;
    }
    if (!user.confirmedAt) {
      throw new ForbiddenException('User is not confirmed');
    }
    return user;
  }

  async getMany(userIds: Array<number>): Promise<Array<User>> {
    const users = await this.userRepository.readAllEntities({
      where: {
        id: In(userIds),
      },
    });
    const areExist = users.every(user => userIds.includes(user.id));
    if (!areExist) {
      throw new NotFoundException('The entities are not exist');
    }
    return users;
  }

  private async getUnapprovedUser(id: number): Promise<User> {
    const user = await this.userRepository.readEntityById(id, {
      where: { confirmedAt: null, lockedAt: null, },
    });
    if (!user) {
      throw new NotFoundException('User with this id not found.');
    }
    return user;
  }

  async getUserWithStripeAccountId(id: number): Promise<User> {
    const user = await this.userRepository.readEntityById(id, { select: [
      'id',
      'createdAt',
      'updatedAt',
      'deletedAt',
      'fullName',
      'nickname',
      'avatarImageId',
      'stripeAccountId',
      'countryId',
      'stateId',
      'city',
    ], });
    if (!user) {
      throw new NotFoundException('User with this id was not found');
    }
    return user;
  }

  async readByUniqKey(uniqKey: string): Promise<User> {
    const user = await this.userRepository.readEntity({ where: { uniqKey, }, });
    if (!user) {
      throw new NotFoundException('User was not found');
    }
    return user;
  }

  private getUserLevels(levels: Omit<GetUsersWithoutGroupDTO, 'search'>): Array<UserLevelEnum> {
    type UserLevels = keyof Omit<GetUsersWithoutGroupDTO, 'search'>;
    const levelsMap: Record<UserLevels, UserLevelEnum> = {
      goalGetterI: UserLevelEnum.GOAL_GETTER_I,
      goalGetterII: UserLevelEnum.GOAL_GETTER_II,
      leaderI: UserLevelEnum.LEADER_I,
      leaderII: UserLevelEnum.LEADER_II,
      trueLeaderI: UserLevelEnum.TRUE_LEADER_I,
      trueLeaderII: UserLevelEnum.TRUE_LEADER_II,
      master: UserLevelEnum.MASTER,
      ultimateChallenge: UserLevelEnum.ULTIMATE_CHALLENGE,
    };
    return Object.keys(levels)
      .filter((level: UserLevels) => levels[level] === true)
      .map((level: UserLevels) => levelsMap[level]);
  }
}
