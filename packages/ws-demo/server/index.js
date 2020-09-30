const socket_server = require('ws').Server
const http = require('http')


const app = http.createServer()

const server = app.listen(3000, () => {
    console.log('server is on %d', 3000)
})

const wss = new socket_server({
    server
})

wss.on('connection', (ws) => {
    console.log('wss open connect')

    ws.on('message', (data)=>{
        wss.clients.forEach((websocket)=>{
            websocket.send(data)
        })
    })
})
