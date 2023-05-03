import { Module } from '@nestjs/common';
import { WinstonModule } from "nest-winston";
import { format, transports } from "winston";
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { ChatsRepository } from "./chats.repository";
import { redisStore } from "cache-manager-redis-yet";
import { EnvUtils } from "../../utils/env.utils";
import { CacheModule } from "@nestjs/cache-manager";
import { CacheHelper } from "../../components/helpers/cache.helper";

@Module({
    imports: [
        WinstonModule.forRoot({
            transports: [
                new transports.File({
                    level: 'debug',
                    filename: 'logs/onboarding-debug.log'
                }),
                new transports.File({
                    level: 'error',
                    filename: 'logs/onboarding-error.log',
                })
            ],
            format: format.combine(
                format.errors({ stack: true }),
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                format.printf(info => `${[info.timestamp]}|[${info.level.toUpperCase()}]|${info.message}|${info.level.toUpperCase()} STACK:\n${info.stack}`),
            ),
        }),
        CacheModule.register({
            store: redisStore,
            url: EnvUtils.getRedisUrl(),
            isGlobal: true,
        }),
    ],
    controllers: [ChatsController],
    providers: [
        ChatsService,
        ChatsRepository,
        CacheHelper,
    ],
    exports: [
        ChatsService,
        ChatsRepository,
    ],
})
export class ChatsModule { }
