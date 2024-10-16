import { Logger, Module } from '@nestjs/common';

import { DbPrismaService } from './db-prisma.service';
import { ProfileRepository } from './repositories/profile.repository';
import { ProfileQueryBuilder } from './query-builders/profile.query-builder';

@Module({
    providers: [DbPrismaService, Logger, ProfileRepository, ProfileQueryBuilder],
    exports: [ProfileRepository, ProfileQueryBuilder],
})
export class DbPrismaModule {}
