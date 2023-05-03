import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { Constants } from "../../utils/constants";

@Controller({
    path: "chats",
    version: Constants.API_VERSION_1
})
export class ChatsController {

    constructor(private readonly chatsService: ChatsService) { }

    @Post()
    async create(@Body() dto: any) {
        return this.chatsService.create(dto);
    }

    @Get()
    async findAllForUser(
        @Query("user_sk") userSk: string,
        @Query("limit") limit: string,
        @Query("start_key") startKey: any,
    ) {
        return await this.chatsService.findAllForUser(
            userSk,
            parseInt(limit),
            startKey
        );
    }

    @Get("/ws-endpoint")
    async getChatWSEndpointPort() {
        return await this.chatsService.getChatWSEndpointPort();
    }
}
