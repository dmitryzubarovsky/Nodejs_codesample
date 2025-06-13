import { ForbiddenException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppConfigService } from '../common/services';
import { CONFIG_PROVIDER_TOKEN } from '../common/services/types';
import { compareHashPassword } from '../common/utilities';
import { AdminService } from '../admins/admin.service';
import { UserService } from '../users/user.service';
import { AuthorizationResponseDTO } from './DTO';
import type{ JwtPayload, Person } from './models';
import { UserLevelEnum } from '../common/enums';
import { SaleService } from '../sales/sale.service';
import { GroupUsersService } from '../group-users/group-users.service';
import { validateCredentials } from '../common/validators/manual-validator';

@Injectable()
export class AuthService {
  constructor(
      private readonly jwtService: JwtService,
      @Inject(forwardRef(() => UserService))
      private readonly userService: UserService,
      @Inject(forwardRef(() => AdminService))
      private readonly adminService: AdminService,
      @Inject(forwardRef(() => SaleService))
      private readonly saleService: SaleService,
      @Inject(forwardRef(() => GroupUsersService))
      private readonly groupUserService: GroupUsersService,
      @Inject(CONFIG_PROVIDER_TOKEN)
      private readonly config: AppConfigService
  ) { }

  async validateUserCredentials(username: string, password: string): Promise<JwtPayload> {
    validateCredentials(username, password);
    let user;
    let payload = null;
    try {
      user = await this.userService.readByEmail(username.toLowerCase(), true);
    } catch {
      throw new ForbiddenException('Access is unavailable');
    }

    if (user.lockedAt !== null) {
      throw new ForbiddenException('User is locked');
    } else if (user?.password && await compareHashPassword(password, user.password)) {
      payload = { userId: user.id, };
    }
    return payload;
  }

  async validateAdminCredentials(username: string, password: string): Promise<JwtPayload> {
    validateCredentials(username, password);
    const admin = await this.adminService.findByEmail(username.toLowerCase());
    if (!admin) {
      throw new ForbiddenException('Access is unavailable');
    }
    let payload = null;
    if (admin?.password && await compareHashPassword(password, admin.password) && admin.lockedAt === null) {
      payload = { adminId: admin.id, };
    }
    return payload;
  }

  async validatePerson(payload: JwtPayload): Promise<Person> {
    const user = payload.userId ? await this.userService.readByIdWithoutException(payload.userId) : undefined;
    let person: Person;
    if (user) {
      if (user.lockedAt === null) {
        person = {
          userId: user.id,
          groupId: null,
          adminGroupId: null,
          isAdmin: false,
          level: this.getLevel(user.id),
        };
        const groupUsers = await this.groupUserService.getGroupUsersByUserId(user.id);
        if (groupUsers) {
          person.groupId = groupUsers.groupMember?.group.id;
          person.adminGroupId = groupUsers.adminGroup?.group.id;
        }
      }
    } else {
      const admin = payload.adminId ? await this.adminService.readByIdWithoutException(payload.adminId) : undefined;
      if (admin && admin.lockedAt === null) {
        person = {
          adminId: admin.id,
          adminRole: admin.role,
          isAdmin: true,
        };
      }
    }
    return person;
  }

  authorizeUser(user: Person): AuthorizationResponseDTO {
    const payload = user;
    const expiresIn = this.config.jwtExpires;
    const accessToken = this.jwtService.sign(payload, { expiresIn, });
    const milliseconds = 1000;
    return { accessToken, expirationDate: new Date(Date.now() + expiresIn * milliseconds), userId: user.userId, };
  }

  private async getLevel(userId: number): Promise<UserLevelEnum> {
    const [ userLevel, ] = await this.saleService.getUsersLevel([ userId, ]);
    return userLevel.level;
  }
}
