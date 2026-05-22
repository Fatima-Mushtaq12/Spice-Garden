import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      transports: ['websocket', 'polling'],
      autoConnect: false,
    })
  }
  return socket
}

export function connectSocket(): Socket {
  const s = getSocket()
  if (!s.connected) s.connect()
  return s
}

export function disconnectSocket() {
  if (socket?.connected) {
    socket.disconnect()
  }
}

export function joinOrderRoom(orderId: string) {
  const s = getSocket()
  s.emit('join:order', orderId)
}

export function joinRestaurantRoom(restaurantId: string) {
  const s = getSocket()
  s.emit('join:restaurant', restaurantId)
}
