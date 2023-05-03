import { Inject, Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatsService } from "../chats/chats.service";
import { ChatsRepository } from "../chats/chats.repository";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import JsonUtils from "../../utils/json.utils";

@Injectable()
export class WsService {
    @WebSocketServer()
    server: Server
    sockets: Socket[];

    constructor(
        private readonly chatsService: ChatsService,
        private readonly chatsRepository: ChatsRepository,
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly logger: Logger,
    ) {
        this.sockets = [];
    }

    addSocket(socket: Socket) {
        this.sockets.push(socket);
    }

    removeSocket(socket: Socket) {
        try {
            const toRemSocket = this.sockets.find(s => s.id === socket.id);
            const index = this.sockets.indexOf(toRemSocket);
            this.sockets.splice(index, 1);
        }
        catch(e) {

        }
    }

    async joinRoom(socket: Socket, dto: any) {
        const message = JsonUtils.parse(dto);
        socket.join(message.roomName);
        socket.emit("joinedRoom", message.roomName);
    }

    async leaveRoom(socket: Socket, dto: any) {
        const message = JsonUtils.parse(dto);
        console.log(message)
        socket.leave(message.roomName);
        socket.emit("leftRoom", message.roomName);
    }

    async sendMessage(socket: Socket, dto: any) {
        try {
            const message = JsonUtils.parse(dto);
            console.log(message.receiver);
            const data = await this.chatsService.create(message);
            console.log(message)
            socket.broadcast.to(message.receiver.id).emit("message", message);
            this.server.to(message.receiver.id).emit("message1", message);
        }
        catch(e) {

        }
    }

    async sendMessageToRoom(socket: Socket, dto: any) {
        try {
            const message = JsonUtils.parse(dto);
            console.log(message.receiver);
            const data = await this.chatsService.create(message);
            console.log(message)
            this.server.to(message.roomName).emit("roomMessage", message);
            socket.broadcast.to(message.roomName).emit("roomMessage1", message);
            console.log(message);
        }
        catch(e) {

        }
    }
}
