import { Module } from '@nestjs/common';

import { dynamicModules } from './config/dynamic.module';
import { staticModules } from './config/static.module';

@Module({
    imports: [...dynamicModules, ...staticModules],
})
export class AppModule {}
