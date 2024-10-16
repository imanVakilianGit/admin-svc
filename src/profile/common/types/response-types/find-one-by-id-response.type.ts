import { admin } from '@prisma/client';
import { BaseSuccessResponseInterface } from '../../../../common/interface/base-success-response.interface';

export type FindOneAdminProfileByIdResponseType = BaseSuccessResponseInterface & {
    data: admin;
};
