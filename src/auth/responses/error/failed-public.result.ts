import { BaseFailedResponseInterface } from '../../../common/interface/base-failed-response.interface';

export const FAILED_ADMIN_UNAUTHORIZED: BaseFailedResponseInterface = {
    message: 'need to login',
    code: 'FAILED_ADMIN_UNAUTHORIZED',
};
