import { BadRequestException, Injectable } from '@nestjs/common';
import { cpf } from 'cpf-cnpj-validator';

import { IManualValidator } from '../common/interface';
import { CreateBankAccountDTO } from './DTO';
import { isDefined } from '../common/validators/manual-validator';

@Injectable()
export class BankAccountValidator implements IManualValidator<CreateBankAccountDTO> {
  validate(data: CreateBankAccountDTO): void {
    if (isDefined(data.cpf) && !cpf.isValid(data.cpf)) {
      throw new BadRequestException('cpf must be in valid format');
    }
  }
}
