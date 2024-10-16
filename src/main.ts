import { NestFactory } from '@nestjs/core';
import { RpcException, TcpOptions, Transport } from '@nestjs/microservices';
import { INestMicroservice, ValidationError, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { APP_NAME } from './common/constant/service-name.constant';
import { GlobalResponseInterceptor } from './common/interceptor/global-response.interceptor';

async function bootstrap(): Promise<void> {
    const port: number = Number(process.env.APP_PORT);

    const app: INestMicroservice = await NestFactory.createMicroservice<TcpOptions>(AppModule, {
        transport: Transport.TCP,
        options: {
            port,
        },
    });

    app.useGlobalInterceptors(new GlobalResponseInterceptor());

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            stopAtFirstError: true,
            forbidNonWhitelisted: true,
            forbidUnknownValues: true,
            disableErrorMessages: true,
            exceptionFactory: (errors: ValidationError[]): RpcException => {
                console.log(new Date().toLocaleString('fa'), ' ------ validation error: ', errors);
                return new RpcException({
                    service: APP_NAME,
                    success: false,
                    statusCode: 400,
                    message: errors[0]?.constraints
                        ? Object.values(errors[0].constraints)[0]
                        : Object.values(errors[0].children?.[0]?.constraints || {})[0],
                    code: 'VALIDATION_ERROR',
                    field: errors[0]?.constraints ? errors[0].property : errors[0].children?.[0]?.property,
                });
            },
        }),
    );

    await app.listen();
    console.log('👽 ~ admin-svc:', `server running on port: ${port}`);
}
bootstrap();
