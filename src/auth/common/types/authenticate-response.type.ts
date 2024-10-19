import { admin } from '@prisma/client';

import { AccessAndRefreshTokenInterface } from '../interface/access-and-refresh-token.interface';
import { BaseSuccessResponseInterface } from '../../../common/interface/base-success-response.interface';

export type AuthenticateAdminResponseType = BaseSuccessResponseInterface & {
    data: AccessAndRefreshTokenInterface & admin;
};
