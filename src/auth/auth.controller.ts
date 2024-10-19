import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AuthService } from './auth.service';
import { AuthenticateAdminDto } from './common/dto/authenticate.dto';
import { AuthenticateAdminResponseType } from './common/types/authenticate-response.type';
import { BaseSuccessResponseInterface } from '../common/interface/base-success-response.interface';
import { ConfirmLoginResponseType } from './common/types/confirm-login-response.type';
import { ConfirmLoginDto } from './common/dto/confirm-login.dto';
import { LogoutAdminDto } from './common/dto/logout.dto';
import { LoginAdminByEmailDto, LoginAdminByMobileDto } from './common/dto/login.dto';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @MessagePattern('login_admin')
    login(@Payload() dto: LoginAdminByEmailDto | LoginAdminByMobileDto): Promise<BaseSuccessResponseInterface> {
        return this.authService.login(dto);
    }

    @MessagePattern('confirm_login_admin')
    confirmLogin(@Payload() dto: ConfirmLoginDto): Promise<ConfirmLoginResponseType> {
        return this.authService.confirmLogin(dto);
    }

    @MessagePattern('logout_admin')
    logout(@Payload() dto: LogoutAdminDto): Promise<BaseSuccessResponseInterface> {
        return this.authService.logout(dto);
    }

    @MessagePattern('authenticate_admin')
    authenticate(@Payload() dto: AuthenticateAdminDto): Promise<AuthenticateAdminResponseType> {
        return this.authService.authenticate(dto);
    }
}
