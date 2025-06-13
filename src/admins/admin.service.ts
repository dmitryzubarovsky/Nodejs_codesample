import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common';

import type {
  AdminResponseDTO,
  ChangePasswordForRootDTO,
  CreateAdminDTO,
  CreateAdminResponseDTO,
  ProfileResponseDTO,
  ReadNameResponseDTO
} from './DTO';
import { compareHashPassword, generatePasswordHash } from '../common/utilities';
import { AdminRepository } from './admin.repository';
import { Admin } from './admin.entity';
import { AdminRoleEnum, EmailTypeEnum, MailTokenTypeEnum } from '../common/enums';
import type { BaseMessageDTO } from '../common/base';
import type { Person } from '../auth/models';
import type { ChangePasswordDTO } from '../common/DTO';
import { MailService } from '../mail/mail.service';
import { defaultEmail } from '../common/constants';
import { MailTokenService } from '../mail-tokens/mail-token.service';

@Injectable()
export class AdminService {
  constructor(private readonly adminRepository: AdminRepository,
              @Inject(forwardRef(() => MailService))
              private readonly mailService: MailService,
              @Inject(forwardRef(() => MailTokenService))
              private readonly mailTokenService: MailTokenService
  ) { }

  async create(body: CreateAdminDTO): Promise<CreateAdminResponseDTO> {
    if (body.role === AdminRoleEnum.ROOT) {
      throw new ForbiddenException('Client doesn\'t have sufficient permissions');
    }

    const isExists = !! await this.adminRepository.readEntity({
      where: { email: body.email, },
    });
    if (isExists) {
      throw new BadRequestException('Admin with this email already exists');
    }
    const password = await generatePasswordHash(body.password);
    const createdAdmin = await this.adminRepository.createEntity({ ...body, password, });
    delete createdAdmin.password;
    return createdAdmin;
  }

  async readAll(): Promise<Array<AdminResponseDTO>> {
    const admins = await this.adminRepository.readAllEntities();
    return admins.map(
      ({ lockedAt, ...admin }) =>
        ({ isLocked: !!lockedAt, ...admin, }));
  }

  async read(adminId: number): Promise<AdminResponseDTO> {
    const { lockedAt, ...admin } = await this.adminRepository.readEntityById(adminId);
    if (!admin) {
      throw new NotFoundException('The entity with this id was not found');
    }
    return { isLocked: !!lockedAt, ...admin, };
  }

  async changePassword(person: Person, body: ChangePasswordDTO): Promise<BaseMessageDTO> {
    const admin = await this.adminRepository.readEntityById(person.adminId, { select: [ 'id', 'password', ], });
    if (!await compareHashPassword(body.currentPassword, admin.password)) {
      throw new ForbiddenException('Invalid current password');
    }

    if (await compareHashPassword(body.newPassword, admin.password)) {
      throw new BadRequestException('The new password must be different from the current');
    }
    await this.adminRepository.updateEntity(admin.id, { password: await generatePasswordHash(body.newPassword), });
    return { message: 'Password changed successfully', };
  }

  async readProfile(id: string | number): Promise<ProfileResponseDTO> {
    const admin = await this.adminRepository.readEntityById(id);
    if (!admin) {
      throw new NotFoundException('Admin with this id not found.');
    }
    return admin;
  }

  async readName(person: Person): Promise<ReadNameResponseDTO> {
    const admin = await this.adminRepository.readEntityById(person.adminId);
    return { name: admin.fullName, };
  }

  findByEmail(email: string): Promise<Admin> {
    return this.adminRepository.readEntity({
      where: { email, },
      select: [ 'id', 'email', 'password', 'role', 'lockedAt', ],
    });
  }

  readByIdWithoutException(id: number): Promise<Admin> {
    return this.adminRepository.readEntityById(id);
  }

  async update(id: number, body: CreateAdminDTO): Promise<AdminResponseDTO> {
    const existingAdmin = await this.read(id);
    if (existingAdmin.role === AdminRoleEnum.ROOT) {
      throw new ForbiddenException('Root admin must not be edited');
    }
    const { lockedAt, ...admin } = await this.adminRepository.updateEntity(id, {
      ...body,
      password: await generatePasswordHash(body.password),
    });
    return { isLocked: !!lockedAt, ...admin, };
  }

  async lock(id: number): Promise<BaseMessageDTO> {
    const admin = await this.read(id);
    if (admin.role === AdminRoleEnum.ROOT) {
      throw new ForbiddenException('Root admin must not be locked');
    }
    if (admin.isLocked) {
      throw new BadRequestException('Admin is already locked');
    }
    await this.adminRepository.updateEntity(id, { lockedAt: new Date(), });
    return { message: 'Admin has successfully locked', };
  }

  async unlock(id: number): Promise<BaseMessageDTO> {
    const admin = await this.read(id);
    if (!admin.isLocked) {
      throw new BadRequestException('Admin is not locked');
    }
    await this.adminRepository.updateEntity(id, { lockedAt: null, });
    return { message: 'Admin has successfully unlocked', };
  }

  async changeEmail(person: Person, email: string): Promise<BaseMessageDTO> {
    const admin = await this.adminRepository.readEntityById(person.adminId);
    if (admin.email !== defaultEmail) {
      throw new ForbiddenException('Access is unavailable');
    }
    const mailToken = await this.mailTokenService.create({ type: MailTokenTypeEnum.ADMIN_EMAIL_CONFIRMATION, admin, newEmail: email, });
    await this.mailService.sendEmail({
      handlebars: [ admin.id, ],
      type: EmailTypeEnum.ADMIN_CONFIRM_EMAIL,
      email,
      mailToken: mailToken.token,
    });
    return { message: 'Email changed successfully', };
  }

  async changePasswordForRoot(body: ChangePasswordForRootDTO): Promise<BaseMessageDTO> {
    const mailToken = await this.mailTokenService.activate(body.token, MailTokenTypeEnum.ADMIN_EMAIL_CONFIRMATION);
    const password = await generatePasswordHash(body.password);
    await this.adminRepository.updateEntity(mailToken.admin.id, { email: mailToken.newEmail, password, });
    return { message: 'Password changed successfully', };
  }
}
