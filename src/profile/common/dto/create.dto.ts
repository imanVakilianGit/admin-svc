import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length, Matches, MaxDate } from 'class-validator';

import { AdminRoleEnum } from '../../../common/enum/admin-role.enum';
import { PERSIAN_MOBILE_NUMBER_REGEX } from '../../../common/regex/persian-mobile-number.regex';

export class CreateAdminProfileDto {
    @Length(10, 10)
    @IsString()
    @IsNotEmpty()
    nationalCode: string;

    @Matches(PERSIAN_MOBILE_NUMBER_REGEX)
    @Length(11, 11)
    @IsString()
    @IsNotEmpty()
    mobileNumber: string;

    @IsEmail()
    @Length(10, 50)
    @IsString()
    @IsNotEmpty()
    email: string;

    @Length(3, 50)
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @Length(3, 50)
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @MaxDate(new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 18))
    @IsDate()
    @IsOptional()
    birthDate?: Date;

    @IsEnum(AdminRoleEnum)
    @IsString()
    @IsOptional()
    role?: string;
}
