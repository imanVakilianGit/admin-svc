import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { CreateAdminProfileDto } from './common/dto/create.dto';
import { CreateAdminProfileResponseType } from './common/types/response-types/create-response.type';
import { FindOneAdminProfileByIdDto } from './common/dto/find-one-by-id.dto';
import { FindOneAdminProfileByIdResponseType } from './common/types/response-types/find-one-by-id-response.type';
import { ProfileService } from './profile.service';
import { UpdateAdminProfileDto } from './common/dto/update.dto';
import { UpdateAdminProfileResponseType } from './common/types/response-types/update-response.type';

@Controller()
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @MessagePattern('create_admin_profile')
    create(@Payload() dto: CreateAdminProfileDto): Promise<CreateAdminProfileResponseType> {
        return this.profileService.create(dto);
    }

    @MessagePattern('findAllProfile')
    findAll() {
        return this.profileService.findAll();
    }

    @MessagePattern('find_one_admin_profile_by_id')
    findOneById(@Payload() dto: FindOneAdminProfileByIdDto): Promise<FindOneAdminProfileByIdResponseType> {
        return this.profileService.findOneById(dto);
    }

    @MessagePattern('update_admin_profile')
    update(@Payload() dto: UpdateAdminProfileDto): Promise<UpdateAdminProfileResponseType> {
        return this.profileService.update(dto);
    }

    @MessagePattern('removeProfile')
    remove(@Payload() id: number) {
        return this.profileService.remove(id);
    }
}
