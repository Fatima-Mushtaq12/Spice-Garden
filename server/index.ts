import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', connections: io.engine.clientsCount })
})

// HTTP endpoint to emit events from Next.js API routes
app.post('/emit', (req, res) => {
  const { event, room, data } = req.body
  if (!event || !room) {
    return res.status(400).json({ error: 'event and room required' })
  }
  io.to(room).emit(event, data)
  res.json({ success: true })
})

io.on('connection', (socket) => {
  console.log(`[Socket] Connected: ${socket.id}`)

  socket.on('join:order', (orderId: string) => {
    socket.join(`order:${orderId}`)
    console.log(`[Socket] ${socket.id} joined order:${orderId}`)
  })

  socket.on('join:restaurant', (restaurantId: string) => {
    socket.join(`restaurant:${restaurantId}`)
    console.log(`[Socket] ${socket.id} joined restaurant:${restaurantId}`)
  })

  socket.on('driver:location', ({ orderId, lat, lng }: { orderId: string; lat: number; lng: number }) => {
    io.to(`order:${orderId}`).emit('order:driver-location', { orderId, lat, lng })
  })

  socket.on('disconnect', () => {
    console.log(`[Socket] Disconnected: ${socket.id}`)
  })
})

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`[Socket Server] Running on http://localhost:${PORT}`)
})
