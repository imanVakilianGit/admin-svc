import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, map, Observable, tap } from 'rxjs';

import { APP_NAME } from '../constant/service-name.constant';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class GlobalResponseInterceptor implements NestInterceptor {
    constructor() {}
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            tap(async () => {}),
            map((data) => {
                return {
                    service: APP_NAME,
                    success: true,
                    statusCode: 200,
                    ...data,
                };
            }),
            catchError(async (error) => {
                if (error instanceof RpcException) {
                    return error;
                }
                return {
                    service: APP_NAME,
                    success: false,
                    statusCode: error.status || 500,
                    message: error.response?.message || 'server connection failed... try again later',
                    code: error.response?.code || 'INTERNAL_SERVER_ERROR',
                    field: error.response?.field?.[0] || '',
                };
            }),
        );
    }
}
