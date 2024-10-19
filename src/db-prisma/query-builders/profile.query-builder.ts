import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

import { CreateAdminProfileDto } from '../../profile/common/dto/create.dto';
import { UpdateAdminProfileDto } from '../../profile/common/dto/update.dto';

export class ProfileQueryBuilder {
    create(data: CreateAdminProfileDto): Prisma.adminCreateArgs<DefaultArgs> {
        return {
            data: {
                national_code: data.nationalCode,
                mobile_number: data.mobileNumber,
                email: data.email,
                first_name: data.firstName,
                last_name: data.lastName,
            },
        };
    }

    findUniqueById(id: number): Prisma.adminFindUniqueArgs<DefaultArgs> {
        return {
            where: {
                id,
            },
        };
    }

    update(data: UpdateAdminProfileDto): Prisma.adminUpdateArgs<DefaultArgs> {
        return {
            where: {
                id: data.id,
            },
            data: {
                first_name: data.firstName,
                last_name: data.lastName,
                birth_date: data.birthDate,
            },
        };
    }

    checkExist(value: string): Prisma.adminFindFirstArgs<DefaultArgs> {
        return {
            where: {
                OR: [{ mobile_number: value }, { email: value }],
            },
        };
    }
}
