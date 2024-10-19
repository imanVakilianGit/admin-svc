import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { randomInt } from 'crypto';
import { admin, admins_on_refresh_tokens, Prisma } from '@prisma/client';

import { AccessAndRefreshTokenInterface } from './common/interface/access-and-refresh-token.interface';
import { AuthenticateAdminResponseType } from './common/types/authenticate-response.type';
import { AuthQueryBuilder } from '../db-prisma/query-builders/auth.query-builder';
import { AuthRepository } from '../db-prisma/repositories/auth.repository';
import { AuthenticateAdminDto } from './common/dto/authenticate.dto';
import { BaseSuccessResponseInterface } from '../common/interface/base-success-response.interface';
import { CacheService } from '../cache/cache.service';
import { ConfirmLoginDto } from './common/dto/confirm-login.dto';
import { CustomJwtService } from '../jwt/jwt.service';
import { ConfirmLoginResponseType } from './common/types/confirm-login-response.type';
import { FAILED_ADMIN_REFRESH_TOKEN_EXPIRED } from './responses/error/failed-authenticate.result';
import { FAILED_ADMIN_UNAUTHORIZED } from './responses/error/failed-public.result';
import { FAILED_OTP_NOT_EXPIRED_YET } from './responses/error/failed-login.result';
import { FAILED_INVALID_OTP } from './responses/error/failed-confirm-login.result';
import { JwtPayloadInterface } from '../common/interface/jwt-payload.interface';
import { LoginTypeEnum } from './common/enum/login-type.enum';
import { LogoutAdminDto } from './common/dto/logout.dto';
import { omitObject } from '../common/function/omit-object';
import { ProfileQueryBuilder } from '../db-prisma/query-builders/profile.query-builder';
import { ProfileRepository } from '../db-prisma/repositories/profile.repository';
import { SUCCESS_OTP_SENT } from './responses/success/success-login.result';
import { SUCCESS_ADMIN_CONFIRM_LOGIN } from './responses/success/success-confirm-login.result';
import { SUCCESS_ADMIN_LOGOUT } from './responses/success/success-logout.result';
import { SUCCESS_ADMIN_AUTHENTICATE } from './responses/success/success-authenticate.result';
import { UserAgentDto } from './common/dto/user-agent.dto';
import { LoginAdminByEmailDto, LoginAdminByMobileDto } from './common/dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly authQueryBuilder: AuthQueryBuilder,
        private readonly authRepository: AuthRepository,
        private readonly profileQueryBuilder: ProfileQueryBuilder,
        private readonly profileRepository: ProfileRepository,
        private readonly jwtService: CustomJwtService,
        private readonly cacheService: CacheService,
    ) {}

    async login(dto: LoginAdminByEmailDto | LoginAdminByMobileDto): Promise<BaseSuccessResponseInterface> {
        try {
            let adminProfile: admin;

            type OtpSenderArgsType = Parameters<typeof this.sendOtpCodeToMobileNumber | typeof this.sendOtpCodeToEmail>;
            let otpSender: (...args: OtpSenderArgsType) => Promise<boolean>;
            let receiver: string;

            if (dto.type === LoginTypeEnum.MOBILE_NUMBER) {
                adminProfile = await this._findOneAdminUniqueByFieldOrFail(dto.mobileNumber);

                otpSender = this.sendOtpCodeToMobileNumber;
                receiver = dto.mobileNumber;
            } else if (dto.type === LoginTypeEnum.EMAIL) {
                adminProfile = await this._findOneAdminUniqueByFieldOrFail(dto.email);

                otpSender = this.sendOtpCodeToEmail;
                receiver = dto.email;
            } else {
                throw new InternalServerErrorException();
            }

            const isExistOtp: boolean = await this.cacheService.isExist(adminProfile.id.toString());
            if (isExistOtp) throw new BadRequestException(FAILED_OTP_NOT_EXPIRED_YET);

            const otpCode: string = this._generateOtpCode();

            await this.cacheService.setOrFail(adminProfile.id.toString(), otpCode);
            console.log('👽 ~ AuthService ~ login ~ otpCode:', otpCode);

            const sendOtpResult: boolean = await otpSender(receiver, otpCode);
            console.log('👽 ~ AuthService ~ login ~ sendOtpResult:', sendOtpResult);

            return SUCCESS_OTP_SENT;
        } catch (error) {
            throw error;
        }
    }

    async confirmLogin(dto: ConfirmLoginDto): Promise<ConfirmLoginResponseType> {
        try {
            const adminProfile: admin = await this._findOneAdminUniqueByFieldOrFail(dto.receiver);

            const recordedOtpCode: string | null = await this.cacheService.get(adminProfile.id.toString());
            if (!recordedOtpCode || dto.otpCode !== recordedOtpCode) throw new UnauthorizedException(FAILED_INVALID_OTP);

            const tokens: AccessAndRefreshTokenInterface = this._generateAccessAndRefreshToken({ adminId: adminProfile.id });

            const queryBuilder: Prisma.admins_on_refresh_tokensUpsertArgs<DefaultArgs> = this.authQueryBuilder.upsert(
                adminProfile.id,
                Object.assign(omitObject(dto, 'otpCode', 'receiver'), { token: tokens.refreshToken }),
            );
            await this.authRepository.upsert(queryBuilder);

            this.cacheService.deleteOrFail(adminProfile.id.toString());

            SUCCESS_ADMIN_CONFIRM_LOGIN.data = tokens;
            return SUCCESS_ADMIN_CONFIRM_LOGIN as ConfirmLoginResponseType;
        } catch (error) {
            throw error;
        }
    }

    async logout(dto: LogoutAdminDto): Promise<BaseSuccessResponseInterface> {
        try {
            await this._findOneAdminByIdOrFail(dto.id);
            const queryBuilder: Prisma.admins_on_refresh_tokensDeleteArgs<DefaultArgs> = this.authQueryBuilder.delete(dto.id);
            await this.authRepository.delete(queryBuilder);

            return SUCCESS_ADMIN_LOGOUT;
        } catch (error) {
            throw error;
        }
    }

    async authenticate(dto: AuthenticateAdminDto): Promise<AuthenticateAdminResponseType> {
        try {
            const validateAccessTokenAndGetPayload: JwtPayloadInterface | undefined = this.jwtService.verifyAccessToken(dto.accessToken);
            if (validateAccessTokenAndGetPayload) {
                const adminProfile: admin = await this._findOneAdminByIdOrFail(validateAccessTokenAndGetPayload.adminId);
                SUCCESS_ADMIN_AUTHENTICATE.data = {
                    ...adminProfile,
                    ...this._generateAccessAndRefreshToken({ adminId: validateAccessTokenAndGetPayload.adminId }),
                };
                return <AuthenticateAdminResponseType>SUCCESS_ADMIN_AUTHENTICATE;
            }

            const validateRefreshTokenAndGetPayload: JwtPayloadInterface | undefined = this.jwtService.verifyRefreshToken(dto.refreshToken);
            if (!validateRefreshTokenAndGetPayload) throw new UnauthorizedException(FAILED_ADMIN_REFRESH_TOKEN_EXPIRED);

            const adminProfile: admin = await this._findOneAdminByIdOrFail(validateRefreshTokenAndGetPayload.adminId);
            await this._findOneRefreshTokenOrFail(Object.assign(omitObject(dto, 'accessToken', 'ip'), validateRefreshTokenAndGetPayload));

            const tokens: AccessAndRefreshTokenInterface = this._generateAccessAndRefreshToken({
                adminId: validateRefreshTokenAndGetPayload.adminId,
            });

            const queryBuilder: Prisma.admins_on_refresh_tokensUpdateArgs<DefaultArgs> = this.authQueryBuilder.update(
                adminProfile.id,
                tokens.refreshToken,
            );
            await this.authRepository.update(queryBuilder);

            SUCCESS_ADMIN_AUTHENTICATE.data = {
                ...adminProfile,
                ...tokens,
            };
            return <AuthenticateAdminResponseType>SUCCESS_ADMIN_AUTHENTICATE;
        } catch (error) {
            console.log('👽 ~ AuthService ~ authenticate ~ error:', error);
            throw error;
        }
    }
    // ==================================== private methods ========================================================================
    private async _findOneAdminUniqueByFieldOrFail(value: string): Promise<admin> {
        const queryBuilder: Prisma.adminFindFirstArgs<DefaultArgs> = this.profileQueryBuilder.checkExist(value);
        const databaseResult: admin | undefined = await this.profileRepository.findFirst(queryBuilder);
        if (!databaseResult) throw new NotFoundException(FAILED_ADMIN_UNAUTHORIZED);
        return databaseResult;
    }

    private async _findOneAdminByIdOrFail(id: number): Promise<admin> {
        const queryBuilder: Prisma.adminFindUniqueArgs<DefaultArgs> = this.profileQueryBuilder.findUniqueById(id);
        const databaseResult: admin | undefined = await this.profileRepository.findUnique(queryBuilder);
        if (!databaseResult) throw new NotFoundException(FAILED_ADMIN_UNAUTHORIZED);
        return databaseResult;
    }

    private async _findOneRefreshTokenOrFail(
        data: Omit<UserAgentDto, 'ip'> & { adminId: number; refreshToken: string },
    ): Promise<admins_on_refresh_tokens> {
        const queryBuilder: Prisma.admins_on_refresh_tokensFindFirstArgs<DefaultArgs> = this.authQueryBuilder.findOneRefreshToken(data);
        const databaseResult: admins_on_refresh_tokens | undefined = await this.authRepository.findFirst(queryBuilder);
        if (!databaseResult) throw new UnauthorizedException(FAILED_ADMIN_UNAUTHORIZED);
        return databaseResult;
    }

    private _generateOtpCode(): string {
        return randomInt(10000, 99999).toString();
    }

    async sendOtpCodeToEmail(email: string, otpCode: string) {
        console.log('👽 ~ AuthService ~ sendOtpCodeToEmail ~ sendOtpCodeToEmail:', { email, otpCode });
        // codes...
        return true;
    }

    async sendOtpCodeToMobileNumber(mobileNumber: string, otpCode: string) {
        console.log('👽 ~ AuthService ~ sendOtpCodeToMobileNumber ~ sendOtpCodeToMobileNumber:', { mobileNumber, otpCode });
        // codes...
        return true;
    }

    private _generateAccessAndRefreshToken(payload: JwtPayloadInterface): AccessAndRefreshTokenInterface {
        return {
            accessToken: this.jwtService.generateAccessToken(payload),
            refreshToken: this.jwtService.generateRefreshToken(payload),
        };
    }
}
