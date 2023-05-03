import { WebSocketGateway, SubscribeMessage, OnGatewayInit, OnGatewayConnection, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { WsService } from './ws.service';
import { Logger, OnModuleInit } from "@nestjs/common";
import { EnvUtils } from "../../utils/env.utils";

@WebSocketGateway(
    EnvUtils.getWsPort(),
    {
        cors: {
            origin: "*",
        },
    }
)
export class WsGateway implements OnModuleInit, OnGatewayInit,
    OnGatewayConnection,
    OnGatewayConnection {

    constructor(private readonly service: WsService) { }

    onModuleInit() {
        console.log("WsGateway.onModuleInit");
    }

    afterInit(server: Server) {
        Logger.debug("WsGateway.afterInit");
        this.service.server = server;
    }

    handleConnection(socket: Socket) {
        Logger.debug(`socket connected ${socket.id}`);
        this.service.addSocket(socket);
        socket.broadcast.emit("socket.connected", {
            socketId: socket.id
        });
    }

    handleDisconnect(socket: Socket) {
        Logger.debug(`socket disconnected ${socket.id}`)
        this.service.removeSocket(socket);
        socket.broadcast.emit("socket.disconnected", {
            socketId: socket.id
        });
    }

    @SubscribeMessage("joinRoom")
    async joinRoom(@ConnectedSocket() socket: Socket, @MessageBody() dto: any) {
        await this.service.joinRoom(socket, dto);
    }

    @SubscribeMessage("leaveRoom")
    async leaveRoom(@ConnectedSocket() socket: Socket, @MessageBody() dto: any) {
        await this.service.leaveRoom(socket, dto);
    }

    @SubscribeMessage("sendMessage")
    async sendMessage(@ConnectedSocket() socket: Socket, @MessageBody() dto: any) {
        await this.service.sendMessage(socket, dto);
    }

    @SubscribeMessage("sendMessageToRoom")
    async sendMessageToRoom(@ConnectedSocket() socket: Socket, @MessageBody() dto: any) {
        await this.service.sendMessageToRoom(socket, dto);
    }
}

