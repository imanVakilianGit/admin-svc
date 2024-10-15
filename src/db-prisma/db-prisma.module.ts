import { Logger, Module } from '@nestjs/common';

import { DbPrismaService } from './db-prisma.service';

@Module({
    providers: [DbPrismaService, Logger],
    exports: [DbPrismaService],
})
export class DbPrismaModule {}
