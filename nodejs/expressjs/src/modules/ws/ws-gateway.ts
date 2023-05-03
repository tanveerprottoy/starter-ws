import { wsServer } from "../../app"

class WsGateway {
    
    listenEvents() {
        wsServer.on('connection', ws => {
            console.log('New client connected!')
            ws.send('connection established')
            ws.on('close', () => console.log('Client has disconnected!'))
            ws.on('message', data => {
                wsServer.clients.forEach(client => {
                    console.log(`distributing message: ${data}`)
                    client.send(`${data}`)
                })
            })
            ws.onerror = function () {
                console.log('websocket error')
            }
        })
    }
}

export default new WsGateway;