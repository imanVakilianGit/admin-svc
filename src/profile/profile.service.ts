import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { admin, Prisma } from '@prisma/client';

import { CreateAdminProfileResponseType } from './common/types/response-types/create-response.type';
import { CreateAdminProfileDto } from './common/dto/create.dto';
import { FindOneAdminProfileByIdResponseType } from './common/types/response-types/find-one-by-id-response.type';
import { FindOneAdminProfileByIdDto } from './common/dto/find-one-by-id.dto';
import { ProfileRepository } from '../db-prisma/repositories/profile.repository';
import { ProfileQueryBuilder } from '../db-prisma/query-builders/profile.query-builder';
import { SUCCESS_CREATE_ADMIN_PROFILE } from './responses/success/success-create.result';
import { SUCCESS_FIND_ONE_ADMIN_PROFILE_BY_ID } from './responses/success/success-find-one-by-id.result';
import { UpdateAdminProfileDto } from './common/dto/update.dto';
import { FAILED_ADMIN_PROFILE_ALREADY_EXIST, FAILED_ADMIN_PROFILE_NOT_FOUND } from './responses/error/failed-public.result';
import { SUCCESS_UPDATE_ADMIN_PROFILE } from './responses/success/success-update.result';
import { UpdateAdminProfileResponseType } from './common/types/response-types/update-response.type';

@Injectable()
export class ProfileService {
    constructor(
        private readonly profileRepository: ProfileRepository,
        private readonly profileQueryBuilder: ProfileQueryBuilder,
    ) {}
    async create(dto: CreateAdminProfileDto): Promise<CreateAdminProfileResponseType> {
        try {
            const queryBuilder: Prisma.adminCreateArgs<DefaultArgs> = this.profileQueryBuilder.create(dto);
            const databaseResult: admin = await this.profileRepository.create(queryBuilder);
            SUCCESS_CREATE_ADMIN_PROFILE.data = databaseResult;
            return <CreateAdminProfileResponseType>SUCCESS_CREATE_ADMIN_PROFILE;
        } catch (error) {
            if (error.code === 'P2002' && error.meta.target) {
                FAILED_ADMIN_PROFILE_ALREADY_EXIST.field = error.meta.target;
                throw new ConflictException(FAILED_ADMIN_PROFILE_ALREADY_EXIST);
            }
            throw error;
        }
    }

    findAll() {
        return `This action returns all profile`;
    }

    async findOneById(dto: FindOneAdminProfileByIdDto): Promise<FindOneAdminProfileByIdResponseType> {
        try {
            const adminProfile: admin = await this._findOneByIdOrFail(dto.id);
            SUCCESS_FIND_ONE_ADMIN_PROFILE_BY_ID.data = adminProfile;
            return <FindOneAdminProfileByIdResponseType>SUCCESS_FIND_ONE_ADMIN_PROFILE_BY_ID;
        } catch (error) {
            throw error;
        }
    }

    async update(dto: UpdateAdminProfileDto): Promise<UpdateAdminProfileResponseType> {
        try {
            await this._findOneByIdOrFail(dto.id);
            const queryBuilder: Prisma.adminUpdateArgs<DefaultArgs> = this.profileQueryBuilder.update(dto);
            const databaseResult: admin = await this.profileRepository.update(queryBuilder);
            SUCCESS_UPDATE_ADMIN_PROFILE.data = databaseResult;
            return <UpdateAdminProfileResponseType>SUCCESS_UPDATE_ADMIN_PROFILE;
        } catch (error) {
            throw error;
        }
    }

    remove(id: number) {
        return `This action removes a #${id} profile`;
    }

    private async _findOneByIdOrFail(id: number): Promise<admin> {
        const queryBuilder: Prisma.adminFindUniqueArgs<DefaultArgs> = this.profileQueryBuilder.findUniqueById(id);
        const databaseResult: admin = await this.profileRepository.findUnique(queryBuilder);
        if (!databaseResult) throw new NotFoundException(FAILED_ADMIN_PROFILE_NOT_FOUND);
        return databaseResult;
    }
}
