import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { JwtPayloadInterface } from '../common/interface/jwt-payload.interface';
import {
    ENV_ACCESS_TOKEN_EXPIRES,
    ENV_ACCESS_TOKEN_SECRET,
    ENV_REFRESH_TOKEN_EXPIRES,
    ENV_REFRESH_TOKEN_SECRET,
} from '../common/constant/environments.constant';

@Injectable()
export class CustomJwtService {
    private readonly _accessTokenSecret: string = this.configService.get<string>(ENV_ACCESS_TOKEN_SECRET) || '';
    private readonly _accessTokenExpires: string = this.configService.get<string>(ENV_ACCESS_TOKEN_EXPIRES) || '';
    private readonly _refreshTokenSecret: string = this.configService.get<string>(ENV_REFRESH_TOKEN_SECRET) || '';
    private readonly _refreshTokenExpires: string = this.configService.get<string>(ENV_REFRESH_TOKEN_EXPIRES) || '';
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    generateAccessToken(payload: JwtPayloadInterface): string {
        return this.jwtService.sign(payload, { secret: this._accessTokenSecret, expiresIn: this._accessTokenExpires });
    }

    generateRefreshToken(payload: JwtPayloadInterface): string {
        return this.jwtService.sign(payload, { secret: this._refreshTokenSecret, expiresIn: this._refreshTokenExpires });
    }

    verifyAccessToken(token: string): JwtPayloadInterface | any {
        try {
            return this.jwtService.verify<JwtPayloadInterface>(token, { secret: this._accessTokenSecret });
        } catch (error) {
            if (error.expiredAt) return undefined;
            throw error;
        }
    }

    verifyRefreshToken(token: string): JwtPayloadInterface | undefined {
        try {
            return this.jwtService.verify<JwtPayloadInterface>(token, { secret: this._refreshTokenSecret });
        } catch (error) {
            if (error.expiredAt) return undefined;
            throw error;
        }
    }
}
