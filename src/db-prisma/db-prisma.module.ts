import { Logger, Module } from '@nestjs/common';

import { AuthRepository } from './repositories/auth.repository';
import { AuthQueryBuilder } from './query-builders/auth.query-builder';
import { DbPrismaService } from './db-prisma.service';
import { ProfileRepository } from './repositories/profile.repository';
import { ProfileQueryBuilder } from './query-builders/profile.query-builder';

@Module({
    providers: [DbPrismaService, Logger, ProfileRepository, ProfileQueryBuilder, AuthRepository, AuthQueryBuilder],
    exports: [ProfileRepository, ProfileQueryBuilder, AuthRepository, AuthQueryBuilder],
})
export class DbPrismaModule {}
