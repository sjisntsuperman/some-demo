var b_send = document.querySelector('.b_send')
var a_send = document.querySelector('.a_send')
var input = document.querySelector('.input')
var submit_button = document.querySelector('.button')

function change_a(msg){
    return a_send.innerHTML = msg
}

function change_b(msg){
    return b_send.innerHTML = msg
}

input.oninput = (e) => {
    change_a(e.target.value)
}

// configs
var server_address = 'ws://localhost:3000'

// ws

var ws = new WebSocket(server_address)

ws.onopen = () => {
    console.log('connect success')
}

ws.onmessage = (msg) => {
    console.log('msg from server is %s', msg.data, {msg})
    change_b(msg.data)
}

// send

submit_button.onclick = () => {
    ws.send(a_send.innerHTML)
}