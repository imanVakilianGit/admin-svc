import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CustomJwtModule } from '../jwt/jwt.module';
import { CacheModule } from '../cache/cache.module';
import { DbPrismaModule } from '../db-prisma/db-prisma.module';

@Module({
    imports: [DbPrismaModule, CustomJwtModule, CacheModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
