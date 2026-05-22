import {
  Html, Head, Body, Container, Section, Heading, Text, Button, Preview,
} from '@react-email/components'

interface OrderStatusUpdateProps {
  orderId: string
  customerName: string
  newStatus: string
  statusLabel: string
  estimatedTime?: number
  trackUrl: string
}

const STATUS_MESSAGES: Record<string, string> = {
  CONFIRMED: "Great news! Your order has been confirmed and is being prepared.",
  PREPARING: "Our chefs are now preparing your delicious meal!",
  READY: "Your order is ready and will be picked up by our driver shortly.",
  OUT_FOR_DELIVERY: "Your order is on its way! Our driver is heading to you.",
  DELIVERED: "Your order has been delivered. Enjoy your meal! 🍽️",
  CANCELLED: "We're sorry, but your order has been cancelled.",
}

export function OrderStatusUpdate({
  orderId, customerName, newStatus, statusLabel, estimatedTime, trackUrl,
}: OrderStatusUpdateProps) {
  const orderRef = orderId.slice(-6).toUpperCase()
  const message = STATUS_MESSAGES[newStatus] || `Your order status is now: ${statusLabel}`

  return (
    <Html>
      <Head />
      <Preview>Order #{orderRef} update: {statusLabel} — Spice Garden</Preview>
      <Body style={{ backgroundColor: '#FAFAF8', fontFamily: 'Inter, sans-serif' }}>
        <Container style={{ maxWidth: 520, margin: '40px auto', backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <Section style={{ backgroundColor: '#D85A30', padding: '24px 32px' }}>
            <Heading style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>Order Update</Heading>
            <Text style={{ color: 'rgba(255,255,255,0.85)', margin: '6px 0 0', fontSize: 13 }}>Spice Garden · Order #{orderRef}</Text>
          </Section>

          <Section style={{ padding: '28px 32px' }}>
            <Text style={{ fontSize: 15, color: '#2C2C2A', lineHeight: 1.6, marginTop: 0 }}>
              Hi {customerName},
            </Text>
            <Text style={{ fontSize: 15, color: '#444', lineHeight: 1.6 }}>{message}</Text>

            <Section style={{ backgroundColor: '#FDF2EE', borderRadius: 12, padding: '16px 20px', margin: '20px 0', textAlign: 'center' }}>
              <Text style={{ margin: 0, fontSize: 12, color: '#D85A30', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Current Status
              </Text>
              <Text style={{ margin: '8px 0 0', fontSize: 20, fontWeight: 700, color: '#2C2C2A' }}>{statusLabel}</Text>
              {estimatedTime && newStatus !== 'DELIVERED' && newStatus !== 'CANCELLED' && (
                <Text style={{ margin: '6px 0 0', fontSize: 14, color: '#666' }}>
                  Estimated time: ~{estimatedTime} minutes
                </Text>
              )}
            </Section>

            <Button
              href={trackUrl}
              style={{ display: 'block', textAlign: 'center', backgroundColor: '#D85A30', color: '#fff', fontWeight: 600, padding: '12px 28px', borderRadius: 10, textDecoration: 'none', fontSize: 14, marginTop: 20 }}
            >
              Track Order
            </Button>

            <Text style={{ fontSize: 13, color: '#999', marginTop: 20, textAlign: 'center' }}>
              Questions? Call us at +92 42 3576 1234
            </Text>
          </Section>

          <Section style={{ backgroundColor: '#2C2C2A', padding: '16px 32px', textAlign: 'center' }}>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>
              © {new Date().getFullYear()} Spice Garden Restaurant
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default OrderStatusUpdate
