import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

import { UserAgentDto } from '../../auth/common/dto/user-agent.dto';

export class AuthQueryBuilder {
    findOneRefreshToken(
        data: Omit<UserAgentDto, 'ip'> & { adminId: number; refreshToken: string },
    ): Prisma.admins_on_refresh_tokensFindFirstArgs<DefaultArgs> {
        return {
            where: {
                admin_id: data.adminId,
                token: data.refreshToken,
                user_agent: data.userAgent,
                os: data.os,
                browser: data.browser,
            },
        };
    }

    // todo: update
    upsert(adminId: number, data: UserAgentDto & { token: string }): Prisma.admins_on_refresh_tokensUpsertArgs<DefaultArgs> {
        return {
            where: {
                admin_id: adminId,
            },
            create: {
                token: data.token,
                user_agent: data.userAgent,
                os: data.os,
                ip: data.ip,
                browser: data.browser,
                admin: { connect: { id: adminId } },
            } as Prisma.admins_on_refresh_tokensCreateInput,
            update: {
                token: data.token,
                user_agent: data.userAgent,
                os: data.os,
                ip: data.ip,
                browser: data.browser,
            },
        };
    }

    delete(adminId: number): Prisma.admins_on_refresh_tokensDeleteArgs<DefaultArgs> {
        return {
            where: {
                admin_id: adminId,
            },
        };
    }

    update(adminId: number, refreshToken: string): Prisma.admins_on_refresh_tokensUpdateArgs<DefaultArgs> {
        return {
            where: {
                admin_id: adminId,
            },
            data: {
                token: refreshToken,
            },
        };
    }
}
