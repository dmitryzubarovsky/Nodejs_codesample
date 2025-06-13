import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Patch, Post, Put, Query } from '@nestjs/common';

import { BaseController, BaseMessageDTO, BaseQueryDTO } from '../common/base';
import { Access, AuthGuard, Roles, IsGroupAdmin } from '../common/decorators';
import { AccessEnum, AdminRoleEnum } from '../common/enums';
import { AuthUser } from '../auth/decorators';
import { UserService } from './user.service';
import {
  ChangePasswordDTO,
  RatingQueryDTO,
  StaticsResponseDTO,
  TokenDTO,
  TotalResponseDTO,
  WeekQueryDTO,
  EmailDTO, PayoutPendingUsersDTO
} from '../common/DTO';
import { Person } from '../auth/models';
import {
  AddressResponseDTO,
  ConfirmEmailDTO,
  GetUsersWithoutGroupDTO,
  GrouplessMembersResponseDTO,
  PendingUsersResponseDTO,
  PersonalDataResponseDTO,
  PhoneNumberDTO,
  UserRatingResponseDTO,
  ReadAllUserDTO,
  ReadUserResponseDTO,
  LinkResponseDTO,
  RegisterDTO,
  SetPasswordDTO,
  UpdateAddressDTO,
  UpdateAddressResponseDTO,
  UpdatePersonalDataDTO,
  UpdateProfileDTO,
  UpdateProfileResponseDTO,
  UserProfileResponseDTO
} from './DTO';

@Controller('users')
@ApiTags('Users')
export class UserController extends BaseController {
  constructor(private readonly usersService: UserService) {
    super();
  }

  @ApiCreatedResponse({ description: 'Returns created user', type: BaseMessageDTO, })
  @Post('register')
  create(@Body() body: RegisterDTO): Promise<BaseMessageDTO> {
    return this.usersService.register(body);
  }

  @ApiOkResponse({ description: 'Returns status of setting the password', type: BaseMessageDTO, })
  @Patch('set-password')
  setPassword(@Body() body: SetPasswordDTO): Promise<BaseMessageDTO> {
    return this.usersService.setPassword(body);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns status of password changing', type: BaseMessageDTO, })
  @Access(AccessEnum.USER)
  @Patch('change-password')
  changePassword(@AuthUser() user: Person, @Body() body: ChangePasswordDTO): Promise<BaseMessageDTO> {
    return this.usersService.changePassword(user, body);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns status of phone number changing', type: BaseMessageDTO, })
  @Access(AccessEnum.USER)
  @Patch('change-phone-number')
  changePhoneNumber(@AuthUser() user: Person, @Body() body: PhoneNumberDTO): Promise<BaseMessageDTO> {
    return this.usersService.changePhoneNumber(user, body.phoneNumber);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns status of sent link on change the email', type: BaseMessageDTO, })
  @Access(AccessEnum.USER)
  @Patch('confirm-change-email')
  confirmChangeEmail(@AuthUser() user: Person): Promise<BaseMessageDTO> {
    return this.usersService.confirmChangeEmail(user);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns status of change the email', type: BaseMessageDTO, })
  @Access(AccessEnum.USER)
  @Patch('confirm-new-email')
  confirmNewEmail(@Body() body: ConfirmEmailDTO): Promise<BaseMessageDTO> {
    return this.usersService.confirmNewEmail(body.token, body.email);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns status of change the email', type: BaseMessageDTO, })
  @Patch('set-email')
  setEmail(@Body() body: TokenDTO): Promise<BaseMessageDTO> {
    return this.usersService.setEmail(body.token);
  }

  @ApiOkResponse({ description: 'Forgot password', type: BaseMessageDTO, })
  @Patch('forgot-password')
  forgotPassword(@Body() body: EmailDTO): Promise<BaseMessageDTO> {
    return this.usersService.forgotPassword(body.email);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns found users', type: [ ReadUserResponseDTO, ], })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, ])
  @Access(AccessEnum.ADMIN)
  @Get('all')
  readAll(@Query() query: ReadAllUserDTO): Promise<Array<ReadUserResponseDTO>> {
    return this.usersService.readAll(query);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns pending users', type: [ PendingUsersResponseDTO, ], })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, ])
  @Access(AccessEnum.ADMIN)
  @Get('pending')
  readPendingUsers(): Promise<Array<PendingUsersResponseDTO>> {
    return this.usersService.readPendingUsers();
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Confirms user registration', type: BaseMessageDTO, })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, ])
  @Access(AccessEnum.ADMIN)
  @Patch('approve')
  approveRegistration(@Query() query: BaseQueryDTO): Promise<BaseMessageDTO> {
    return this.usersService.approveRegistration(query.id);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Reject user registration', type: BaseMessageDTO, })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, ])
  @Access(AccessEnum.ADMIN)
  @Patch('reject')
  reject(@Query() query: BaseQueryDTO): Promise<BaseMessageDTO> {
    return this.usersService.reject(query.id);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Locks user', type: BaseMessageDTO, })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, ])
  @Access(AccessEnum.ADMIN)
  @Patch('lock')
  lock(@Query() query: BaseQueryDTO): Promise<BaseMessageDTO> {
    return this.usersService.lockOrUnlock(query.id, true);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Unlocks user', type: BaseMessageDTO, })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, ])
  @Access(AccessEnum.ADMIN)
  @Patch('unlock')
  unlock(@Query() query: BaseQueryDTO): Promise<BaseMessageDTO> {
    return this.usersService.lockOrUnlock(query.id, false);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns users\' rating', type: [ UserRatingResponseDTO, ], })
  @Access(AccessEnum.USER)
  @Get('rating/top')
  readRatingTop(@AuthUser() user: Person, @Query() query: WeekQueryDTO): Promise<Array<UserRatingResponseDTO>> {
    return this.usersService.readRatingTop(user, query.week);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns users\' rating', type: [ UserRatingResponseDTO, ], })
  @Access(AccessEnum.USER)
  @Get('rating/all')
  readRatingAll(@Query() query: RatingQueryDTO): Promise<Array<UserRatingResponseDTO>> {
    return this.usersService.readRatingAll(query);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns users without group', type: [ GrouplessMembersResponseDTO, ], })
  @IsGroupAdmin()
  @Access(AccessEnum.USER)
  @Get('without-group')
  readUsersWithoutGroup(@AuthUser() user: Person, @Query() query: GetUsersWithoutGroupDTO): Promise<Array<GrouplessMembersResponseDTO>> {
    return this.usersService.readUsersWithoutGroup(user, query);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns users without group', type: [ GrouplessMembersResponseDTO, ], })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, ])
  @Access(AccessEnum.ADMIN)
  @Get('without-group/admin')
  readUsersWithoutGroupByAdmin(@AuthUser() user: Person, @Query() query: GetUsersWithoutGroupDTO): Promise<Array<GrouplessMembersResponseDTO>> {
    return this.usersService.readUsersWithoutGroupByAdmin(user, query);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns user\'s profile', type: UserProfileResponseDTO, })
  @Access(AccessEnum.USER)
  @Get('profile')
  readProfile(@Query() query: BaseQueryDTO): Promise<UserProfileResponseDTO> {
    return this.usersService.readProfile(query.id);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns user\'s profile', type: UserProfileResponseDTO, })
  @Access(AccessEnum.USER)
  @Get('profile/by-token')
  readProfileByToken(@AuthUser() user: Person): Promise<UserProfileResponseDTO> {
    return this.usersService.readProfile(user.userId);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns user\'s personal data', type: PersonalDataResponseDTO, })
  @Access(AccessEnum.USER)
  @Get('profile/personal')
  readPersonalData(@AuthUser() user: Person): Promise<PersonalDataResponseDTO> {
    return this.usersService.readPersonalData(user.userId);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns user\'s address', type: AddressResponseDTO, })
  @Access(AccessEnum.USER)
  @Get('profile/address')
  readAddress(@AuthUser() user: Person): Promise<AddressResponseDTO> {
    return this.usersService.readAddress(user.userId);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Updates user\'s profile', type: UpdateProfileResponseDTO, })
  @Access(AccessEnum.USER)
  @Put('profile')
  updateProfile(@AuthUser() user: Person, @Body() body: UpdateProfileDTO): Promise<UpdateProfileResponseDTO> {
    return this.usersService.updateProfile(user.userId, body);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Updates user\'s personal data', type: PersonalDataResponseDTO, })
  @Access(AccessEnum.USER)
  @Put('profile/personal')
  updatePersonalData(@AuthUser() user: Person, @Body() body: UpdatePersonalDataDTO): Promise<PersonalDataResponseDTO> {
    return this.usersService.updatePersonalData(user.userId, body);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Updates user\'s address', type: UpdateAddressResponseDTO, })
  @Access(AccessEnum.USER)
  @Put('profile/address')
  updateAddress(@AuthUser() user: Person, @Body() body: UpdateAddressDTO): Promise<UpdateAddressResponseDTO> {
    return this.usersService.updateAddress(user.userId, body);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns referral link', type: LinkResponseDTO, })
  @Access(AccessEnum.USER)
  @Get('referral-link')
  getReferralLink(@AuthUser() user: Person): Promise<LinkResponseDTO> {
    return this.usersService.getReferralLink(user.userId);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns registration link', type: LinkResponseDTO, })
  @Access(AccessEnum.USER)
  @Get('registration-link')
  getRegistrationLink(@AuthUser() user: Person): LinkResponseDTO {
    return this.usersService.getRegistrationLink(user.userId);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns number of new users', type: StaticsResponseDTO, })
  @Access(AccessEnum.ADMIN)
  @Get('statistics/number-new-users')
  readNumberOfNewUsers(): Promise<StaticsResponseDTO> {
    return this.usersService.getNumberOfNewUsers();
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns number of new users for today', type: TotalResponseDTO, })
  @Access(AccessEnum.ADMIN)
  @Get('statistics/number-new-users/today')
  readNumberOfNewUsersToday(): Promise<TotalResponseDTO> {
    return this.usersService.getNumberOfNewUsersToday();
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns number of new registration users', type: StaticsResponseDTO, })
  @Access(AccessEnum.ADMIN)
  @Get('statistics/number-registration-request')
  readNumberOfRegistrationRequest(): Promise<StaticsResponseDTO> {
    return this.usersService.getNumberOfRegistrationRequest();
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns number of new registration users', type: TotalResponseDTO, })
  @Access(AccessEnum.ADMIN)
  @Get('statistics/number-registration-request/today')
  readNumberOfRegistrationRequestToday(): Promise<TotalResponseDTO> {
    return this.usersService.getNumberOfRegistrationRequestToday();
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns number of registered users', })
  @Access(AccessEnum.ADMIN)
  @Get('statistics/number-registered')
  readNumberOfRegisteredUsers(): Promise<TotalResponseDTO> {
    return this.usersService.getNumberOfRegisteredUsers();
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns payout pending users', type: PayoutPendingUsersDTO, })
  @Access(AccessEnum.ADMIN)
  @Get('payout-pending-users')
  payoutPendingUsers(): Promise<PayoutPendingUsersDTO> {
    return this.usersService.getPayoutPendingUsers();
  }
}
