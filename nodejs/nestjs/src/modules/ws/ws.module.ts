import { Module } from '@nestjs/common';
import { WsService } from './ws.service';
import { WsGateway } from './ws.gateway';
import { ChatsModule } from "../chats/chats.module";

@Module({
    imports: [
        ChatsModule
    ],
    providers: [
        WsGateway,
        WsService,
    ]
})
export class WsModule { }
