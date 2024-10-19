import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CustomJwtService } from './jwt.service';

@Module({
    providers: [CustomJwtService, JwtService],
    exports: [CustomJwtService],
})
export class CustomJwtModule {}
