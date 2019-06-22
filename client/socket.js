import io from 'socket.io-client'

const socket = io(window.location.origin)
// const iotSocket = io('esp8266.local')

socket.on('connect', () => {
  console.log('Connected!')
})

export default socket
