import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

import { LoginTypeEnum } from '../enum/login-type.enum';
import { PERSIAN_MOBILE_NUMBER_REGEX } from '../../../common/regex/persian-mobile-number.regex';

export class LoginAdminByMobileDto {
    type: LoginTypeEnum.MOBILE_NUMBER = LoginTypeEnum.MOBILE_NUMBER;

    @Matches(PERSIAN_MOBILE_NUMBER_REGEX)
    @Length(11, 11)
    @IsString()
    @IsNotEmpty()
    mobileNumber: string;
}

export class LoginAdminByEmailDto {
    type: LoginTypeEnum.EMAIL = LoginTypeEnum.EMAIL;

    @Length(10, 50)
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;
}
