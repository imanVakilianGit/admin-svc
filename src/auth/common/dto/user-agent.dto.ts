import { IsNotEmpty, IsString } from 'class-validator';

export class UserAgentDto {
    @IsNotEmpty()
    @IsString()
    ip: string;

    @IsNotEmpty()
    @IsString()
    browser: string;

    @IsNotEmpty()
    @IsString()
    os: string;

    @IsNotEmpty()
    @IsString()
    userAgent: string;
}
