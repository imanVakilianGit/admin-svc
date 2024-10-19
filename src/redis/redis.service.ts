import { ConfigService } from '@nestjs/config';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

import { ENV_REDIS_PASSWORD, ENV_REDIS_URL } from '../common/constant/environments.constant';

@Injectable()
export class RedisService implements OnModuleInit {
    redisClient: RedisClientType = createClient({
        url: this.configService.get<string>(ENV_REDIS_URL),
        password: this.configService.get<string>(ENV_REDIS_PASSWORD),
    });

    constructor(
        private readonly configService: ConfigService,
        private readonly logger: Logger,
    ) {}

    async onModuleInit(): Promise<void> {
        try {
            await this.redisClient.connect();
            this.logger.log('redis connected successfully');
        } catch (error) {
            this.logger.error('redis connection failed', error);
        }
    }
}
