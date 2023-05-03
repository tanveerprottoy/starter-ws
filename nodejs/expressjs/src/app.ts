import wsGateway from "./modules/ws/ws-gateway";
import { createServer } from "./server";

export const wsServer = createServer();

wsGateway.listenEvents();
