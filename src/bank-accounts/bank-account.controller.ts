import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { BankAccountService } from './bank-account.service';
import { Access, AuthGuard } from '../common/decorators';
import { BaseController, BaseMessageDTO, BaseQueryDTO } from '../common/base';
import { AuthUser } from '../auth/decorators';
import { Person } from '../auth/models';
import { AccessEnum } from '../common/enums';
import { BankAccountResponseDTO, CreateBankAccountDTO } from './DTO';

@AuthGuard()
@ApiBearerAuth()
@Controller('bank-accounts')
@ApiTags('Bank-accounts')
export class BankAccountController extends BaseController {
  constructor(
    private readonly bankAccountService: BankAccountService
  ) {
    super();
  }

  @ApiCreatedResponse({ description: 'Returns created bank account', type: BankAccountResponseDTO, })
  @Access(AccessEnum.USER)
  @Post()
  create(@AuthUser() user: Person, @Body() body: CreateBankAccountDTO): Promise<BankAccountResponseDTO> {
    return this.bankAccountService.create(user, body);
  }

  @ApiOkResponse({ description: 'Returns created bank account', type: BankAccountResponseDTO, })
  @Access(AccessEnum.USER)
  @Put()
  update(@AuthUser() user: Person, @Body() body: CreateBankAccountDTO): Promise<BankAccountResponseDTO> {
    return this.bankAccountService.update(user, body);
  }

  @ApiOkResponse({ description: 'Returns bank account', type: BankAccountResponseDTO, })
  @Access(AccessEnum.USER)
  @Get()
  read(@AuthUser() user: Person): Promise<BankAccountResponseDTO> {
    return this.bankAccountService.read(user.userId);
  }

  @ApiOkResponse({ description: 'Returns bank account', type: BankAccountResponseDTO, })
  @Access(AccessEnum.ADMIN)
  @Get('admin')
  readById(@AuthUser() admin: Person, @Query() query: BaseQueryDTO): Promise<BankAccountResponseDTO> {
    return this.bankAccountService.readById(query.id);
  }

  @ApiOkResponse({ description: 'Returns delete message', type: BaseMessageDTO, })
  @Access(AccessEnum.USER)
  @Delete()
  delete(@AuthUser() user: Person): Promise<BaseMessageDTO> {
    return this.bankAccountService.delete(user.userId);
  }
}
