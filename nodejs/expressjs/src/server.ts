import express from "express";
import cors from "cors";
import { GlobalValues } from "./utils/constants";
import { WebSocketServer } from "ws";

export function createServer() {
    /* const app: express.Application = express();
    const port: number = GlobalValues.PORT;

    // enabling cors for all requests by using cors middleware
    app.use(cors());

    // parse requests of content-type: application/json
    // parses incoming requests with JSON payloads
    app.use(express.json());
    // parse requests of application/x-www-form-urlencoded
    app.use(express.urlencoded({
        extended: true
    }));

    app.listen(port, () => {
        console.log(`server started at http://localhost:${port}`);
    });
    const server = app.listen(3000);
    server.on('upgrade', (request, socket, head) => {
        WebSocketServer.handleUpgrade(request, socket, head, socket => {
            WebSocketServer.emit('connection', socket, request);
        });
    }); */
    const sockserver = new WebSocketServer({ port: GlobalValues.PORT });
    return sockserver;
}

/* export async function createServerCluster() {
    const numCPUs = availableParallelism();

    if(cluster.isPrimary) {
        console.log(`Primary ${process.pid} is running`);

        // Fork workers.
        for(let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} died`);
        });
    } else {
        // Workers can share any TCP connection
        // In this case it is an HTTP server
        http.createServer((req, res) => {
            res.writeHead(200);
            res.end('hello world\n');
        }).listen(8000);

        console.log(`Worker ${process.pid} started`);
    }
} */