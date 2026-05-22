import { z } from 'zod'

export const createBookingSchema = z.object({
  restaurantId: z.string(),
  date: z.string().min(1, 'Date required'),
  time: z.string().min(1, 'Time required'),
  partySize: z.number().int().min(1).max(20),
  name: z.string().min(2, 'Name required'),
  phone: z.string().min(10, 'Valid phone required'),
  email: z.string().email().optional().or(z.literal('')),
  notes: z.string().optional(),
})

export type CreateBookingInput = z.infer<typeof createBookingSchema>
