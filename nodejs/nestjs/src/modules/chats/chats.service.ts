import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ChatsRepository } from "./chats.repository";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { AppUtils } from "../../utils/app.utils";
import { Constants } from "../../utils/constants";
import { ErrorUtils } from "../../utils/error.utils";
import { MessageDto } from "./dto/message.dto";
import { Cache } from 'cache-manager';
import CoreUtils from "../../utils/core.utils";
import { CacheHelper } from "../../components/helpers/cache.helper";
import { EnvUtils } from "../../utils/env.utils";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

@Injectable()
export class ChatsService {

    constructor(
        private readonly repository: ChatsRepository,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private cacheHelper: CacheHelper,
    ) { }

    async create(dto: MessageDto) {
        const timestamp = AppUtils.timeToString();
        const receiver = dto.receiver;
        const sender = dto.sender;
        if(!sender || !receiver) {
            ErrorUtils.throwHttpError(
                Constants.BAD_REQ,
                HttpStatus.BAD_REQUEST
            );
        }
        const item = {
            pk: dto.receiver.id,
            sk: `${timestamp}`,
            receiver: receiver,
            sender: sender,
            message: dto.message,
            createdAt: `${timestamp}`,
        };
        const data = await this.repository.create(item);
        if(data instanceof Error) {
            this.logger.error(data);
            ErrorUtils.throwHttpError(
                Constants.GENERIC_ERROR,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
        if(!data) {
            ErrorUtils.throwHttpError(
                Constants.BAD_REQ,
                HttpStatus.BAD_REQUEST
            );
        }
        await this.findAndUpdateChatCount(
            receiver.id,
            1
        );
        return data;
    }

    async findAllForUser(
        userSk: string,
        limit: number,
        startKey: any,
    ) {
        const expression = "pk = :p0";
        const expressionAttributeValues = {
            ":p0": userSk,
        };
        const data = await this.repository.findAll(
            expression,
            expressionAttributeValues,
            false,
            limit,
            startKey
        );
        return data;
    }

    async findChatCount(
        userSk: string
    ) {
        const data = await this.cacheHelper.get(
            userSk,
            this.cacheManager
        );
        if(!data) {
            ErrorUtils.throwHttpError(
                Constants.NOT_FOUND,
                HttpStatus.NOT_FOUND
            );
        }
        return data;
    }

    async findAndUpdateChatCount(
        userSk: string,
        unreadCount = 0,
    ) {
        // check if exists
        let data = await this.cacheHelper.get(
            userSk,
            this.cacheManager
        );
        if(!data) {
            // create
            const item = {};
            item[userSk] = {
                count: {
                    unreadCount: unreadCount,
                },
            }
            data = await this.cacheHelper.set(
                userSk,
                item,
                0,
                this.cacheManager
            );
        }
        else {
            // update
            if(unreadCount === -1) {
                delete data[userSk];
            }
            else {
                if(!CoreUtils.hasKey(data, userSk)) {
                    data[userSk] = {
                        count: {
                            unreadCount: unreadCount,
                        },
                    }
                }
                else {
                    // increase unread
                    data[userSk].count.unreadCount += unreadCount;
                }
            }
            data = await this.cacheHelper.set(
                userSk,
                data,
                0,
                this.cacheManager
            );
        }
        data = await this.cacheHelper.get(
            userSk,
            this.cacheManager
        );
        return data;
    }

    async findAllPaginatedPub() {
        const expression = "pk = :p0 and begins_with(userKey, :p1)";
        const filterExpression = "value0 <> :p2 and value1 <> :p3";
        const expressionAttributeValues = {
            ":p0": "pk",
            ":p1": "userKey",
            ":p2": "value0",
            ":p3": "value1",
        };
        let items = [];
        items = await this.findAllPaginated(
            expression,
            expressionAttributeValues,
            filterExpression,
            items,
            "gsiIndex",
        );
        return items;
    }

    async processManyPaginatedPub() {
        const expression = "pk = :p0 and begins_with(userKey, :p1)";
        const filterExpression = "value0 <> :p2 and value1 <> :p3";
        const expressionAttributeValues = {
            ":p0": "pk",
            ":p1": "userKey",
            ":p2": "value0",
            ":p3": "value1",
        };
        await this.findManyPaginatedRecursive(
            expression,
            expressionAttributeValues,
            filterExpression,
            "indexName",
            null
        );
    }

    private async findManyPaginatedRecursive(
        expression: string,
        expressionAttributeValues: any,
        filterExpression: string,
        indexName?: string,
        startKey?: any,
    ) {
        const data = await this.findManyPaginated(
            expression,
            expressionAttributeValues,
            filterExpression,
            indexName,
            startKey
        );
        if(data && data.items && data.items.length > 0) {
            // process if needed
            /* for(const item of data.items) {
                
            } */
        }
        if(data.lastKey) {
            await this.findManyPaginatedRecursive(
                expression,
                expressionAttributeValues,
                filterExpression,
                indexName,
                data.lastKey
            );
        }
        else {
            return;
        }
    }

    private async findAllPaginated(
        expression: string,
        expressionAttributeValues: any,
        filterExpression: string,
        items: any[],
        indexName?: string,
        startKey?: any,
    ) {
        let data: any;
        if(startKey) {
            data = await this.repository.findAll(
                expression,
                expressionAttributeValues,
                true,
                0,
                startKey,
                indexName,
                filterExpression
            );
        }
        else {
            data = await this.repository.findAll(
                expression,
                expressionAttributeValues,
                true,
                0,
                null,
                indexName,
                filterExpression
            );
        }
        if(data instanceof Error) {
            this.logger.error(data);
            return items;
        }
        if(!data) {
            return items;
        }
        if(data.items.length > 0) {
            items = [...items, ...data.items];
        }
        if(data.lastKey) {
            await this.findAllPaginated(
                expression,
                expressionAttributeValues,
                filterExpression,
                items,
                indexName,
                data.lastKey
            );
        }
        else {
            return items;
        }
    }

    private async findManyPaginated(
        expression: string,
        expressionAttributeValues: any,
        filterExpression: string,
        indexName?: string,
        startKey?: any,
    ) {
        let data: any;
        if(startKey) {
            data = await this.repository.findAll(
                expression,
                expressionAttributeValues,
                true,
                0,
                startKey,
                indexName,
                filterExpression
            );
        }
        else {
            data = await this.repository.findAll(
                expression,
                expressionAttributeValues,
                true,
                0,
                null,
                indexName,
                filterExpression
            );
        }
        if(data instanceof Error) {
            this.logger.error(data);
            return null;
        }
        return data;
    }

    async getChatWSEndpointPort() {
        return {
            wsEndpoint: `${EnvUtils.getHost()}:${EnvUtils.getWsPort()}`
        };
    }
}
