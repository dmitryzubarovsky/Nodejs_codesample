import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { LocalUserStrategy, JwtStrategy, LocalAdminStrategy, HottokStrategy } from './strategies';
import { AppConfigService } from '../common/services/config/app-config.service';
import { AppConfigModule } from '../common/services/app-config.module';
import { AdminModule } from '../admins/admin.module';
import { AuthController } from './auth.controller';
import { AuthStrategyEnum } from '../common/enums';
import { UserModule } from '../users/user.module';
import { JWTOptionsFactory } from './factories';
import { AuthService } from './auth.service';
import { SaleModule } from '../sales/sale.module';
import { GroupUsersModule } from '../group-users/group-users.module';

@Module({
  controllers: [ AuthController, ],
  providers: [ AuthService, LocalUserStrategy, LocalAdminStrategy, JwtStrategy, AppConfigService, HottokStrategy, ],
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => AdminModule),
    forwardRef(() => SaleModule),
    forwardRef(() => GroupUsersModule),
    PassportModule.register({
      defaultStrategy: AuthStrategyEnum.JWT,
      session: false,
    }),
    JwtModule.registerAsync({
      imports: [ AppConfigModule, ],
      inject: [ AppConfigService, ],
      useClass: JWTOptionsFactory,
    }),
    AppConfigModule,
  ],
})
export class AuthModule {}
