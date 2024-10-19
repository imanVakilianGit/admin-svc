import { DefaultArgs } from '@prisma/client/runtime/library';
import { Injectable } from '@nestjs/common';
import { admin, Prisma } from '@prisma/client';

import { DbPrismaService } from '../db-prisma.service';

@Injectable()
export class ProfileRepository {
    constructor(private readonly prismaService: DbPrismaService) {}

    async create<T extends admin>(data: Prisma.adminCreateArgs<DefaultArgs>): Promise<T> {
        return (await this.prismaService.admin.create(data)) as T;
    }

    async findUnique<T extends admin>(data: Prisma.adminFindUniqueArgs<DefaultArgs>): Promise<T> {
        return (await this.prismaService.admin.findUnique(data)) as T;
    }

    async update<T extends admin>(data: Prisma.adminUpdateArgs<DefaultArgs>): Promise<T> {
        return (await this.prismaService.admin.update(data)) as T;
    }

    async findFirst<T extends admin>(data: Prisma.adminFindFirstArgs<DefaultArgs>): Promise<T | undefined> {
        return (await this.prismaService.admin.findFirst(data)) as T | undefined;
    }
}
