import { Module } from '@nestjs/common';

import { DbPrismaModule } from '../db-prisma/db-prisma.module';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';

@Module({
    imports: [DbPrismaModule],
    controllers: [ProfileController],
    providers: [ProfileService],
})
export class ProfileModule {}
