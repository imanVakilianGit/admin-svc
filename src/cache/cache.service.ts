import { BadRequestException, Injectable } from '@nestjs/common';

import { RedisService } from '../redis/redis.service';

@Injectable()
export class CacheService {
    constructor(private readonly redisService: RedisService) {}

    private ttl: number = 1000 * 60 * 2;
    private readonly keyPrefix: string = 'reservation_test:otp:admin:';

    async setOrFail(key: string, value: string): Promise<string> {
        const result: string | null = await this.redisService.redisClient.set(`${this.keyPrefix}${key}`, value, {
            NX: true,
            PX: this.ttl,
        });
        if (!result) throw new BadRequestException();
        return result;
    }

    async deleteOrFail(key: string): Promise<boolean> {
        const result: number = await this.redisService.redisClient.del(`${this.keyPrefix}${key}`);
        if (!result) throw new BadRequestException();
        return !!result;
    }

    async isExist(key: string): Promise<boolean> {
        return !!(await this.redisService.redisClient.get(`${this.keyPrefix}${key}`));
    }

    async get(key: string): Promise<string | null> {
        const result: string | null = await this.redisService.redisClient.get(`${this.keyPrefix}${key}`);
        return result;
    }
}
