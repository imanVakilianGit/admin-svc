import { ConfigModule } from '@nestjs/config';

export const dynamicModules = [ConfigModule.forRoot({ isGlobal: true })];
