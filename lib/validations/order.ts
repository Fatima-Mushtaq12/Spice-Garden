import { z } from 'zod'

export const createOrderSchema = z.object({
  restaurantId: z.string(),
  type: z.enum(['DELIVERY', 'DINE_IN', 'TAKEAWAY']),
  items: z.array(z.object({
    menuItemId: z.string(),
    quantity: z.number().int().min(1),
    unitPrice: z.number().positive(),
    selectedModifiers: z.any().optional(),
    notes: z.string().optional(),
  })).min(1, 'Cart is empty'),
  deliveryAddress: z.object({
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    lat: z.number().optional(),
    lng: z.number().optional(),
  }).optional(),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
  scheduledFor: z.string().datetime().optional(),
  contact: z.object({
    name: z.string().min(2, 'Name required'),
    phone: z.string().min(10, 'Valid phone required'),
    email: z.string().email().optional().or(z.literal('')),
  }),
  paymentMethod: z.string().default('card'),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
