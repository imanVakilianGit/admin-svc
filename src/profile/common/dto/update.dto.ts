import { IsDate, IsOptional, IsString, Length, MaxDate } from 'class-validator';

import { IdDto } from '../../../common/dto/id.dto';

export class UpdateAdminProfileDto extends IdDto {
    @Length(3, 50)
    @IsString()
    @IsOptional()
    firstName?: string;

    @Length(3, 50)
    @IsString()
    @IsOptional()
    lastName?: string;

    @MaxDate(new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 18))
    @IsDate()
    @IsOptional()
    birthDate?: Date;
}
