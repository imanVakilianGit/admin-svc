import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DbPrismaService extends PrismaClient implements OnModuleInit {
    constructor(private logger: Logger) {
        super();
    }

    async onModuleInit(): Promise<void> {
        try {
            await this.$connect();
            this.logger.log('prisma connected successfully');
        } catch (error) {
            this.logger.error('prisma connection failed', error);
        }
    }
}
