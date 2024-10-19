import { ConfigService } from '@nestjs/config';
import { Logger, Module } from '@nestjs/common';

import { RedisService } from './redis.service';

@Module({
    providers: [RedisService, Logger, ConfigService],
    exports: [RedisService],
})
export class RedisModule {}
