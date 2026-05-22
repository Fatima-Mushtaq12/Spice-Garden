import {
  Html, Head, Body, Container, Section, Row, Column,
  Heading, Text, Button, Hr, Preview, Img,
} from '@react-email/components'

interface OrderItem {
  name: string
  quantity: number
  unitPrice: number
}

interface OrderConfirmationProps {
  orderId: string
  customerName: string
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  discount: number
  total: number
  estimatedTime: number
  trackUrl: string
}

export function OrderConfirmation({
  orderId,
  customerName,
  items,
  subtotal,
  deliveryFee,
  discount,
  total,
  estimatedTime,
  trackUrl,
}: OrderConfirmationProps) {
  const orderRef = orderId.slice(-6).toUpperCase()

  return (
    <Html>
      <Head />
      <Preview>Your order #{orderRef} is confirmed — Spice Garden</Preview>
      <Body style={{ backgroundColor: '#FAFAF8', fontFamily: 'Inter, sans-serif' }}>
        <Container style={{ maxWidth: 560, margin: '40px auto', backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          {/* Header */}
          <Section style={{ backgroundColor: '#D85A30', padding: '32px 40px', textAlign: 'center' }}>
            <Heading style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: 0 }}>
              Spice Garden
            </Heading>
            <Text style={{ color: 'rgba(255,255,255,0.85)', margin: '8px 0 0', fontSize: 14 }}>
              Authentic Pakistani Cuisine, Lahore
            </Text>
          </Section>

          <Section style={{ padding: '32px 40px' }}>
            <Heading as="h2" style={{ fontSize: 22, fontWeight: 600, color: '#2C2C2A', marginTop: 0 }}>
              Order Confirmed! 🎉
            </Heading>
            <Text style={{ color: '#666', fontSize: 15, lineHeight: 1.6 }}>
              Hi {customerName}, your order has been received and our kitchen is already preparing it!
            </Text>

            {/* Order ref */}
            <Section style={{ backgroundColor: '#FDF2EE', borderRadius: 12, padding: '16px 20px', margin: '20px 0' }}>
              <Row>
                <Column>
                  <Text style={{ margin: 0, fontSize: 12, color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order Reference</Text>
                  <Text style={{ margin: '4px 0 0', fontSize: 24, fontWeight: 700, color: '#D85A30', fontFamily: 'monospace' }}>#{orderRef}</Text>
                </Column>
                <Column style={{ textAlign: 'right' }}>
                  <Text style={{ margin: 0, fontSize: 12, color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Est. Time</Text>
                  <Text style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 700, color: '#2C2C2A' }}>~{estimatedTime} min</Text>
                </Column>
              </Row>
            </Section>

            {/* Items */}
            <Heading as="h3" style={{ fontSize: 16, fontWeight: 600, color: '#2C2C2A' }}>Items Ordered</Heading>
            {items.map((item, i) => (
              <Row key={i} style={{ borderBottom: '1px solid #F0F0EF', paddingBottom: 8, marginBottom: 8 }}>
                <Column>
                  <Text style={{ margin: 0, fontSize: 14, color: '#2C2C2A' }}>{item.name} <span style={{ color: '#999' }}>× {item.quantity}</span></Text>
                </Column>
                <Column style={{ textAlign: 'right' }}>
                  <Text style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>PKR {(item.unitPrice * item.quantity).toLocaleString()}</Text>
                </Column>
              </Row>
            ))}

            {/* Totals */}
            <Hr style={{ borderColor: '#F0F0EF', margin: '16px 0' }} />
            {[
              ['Subtotal', subtotal],
              ...(discount > 0 ? [['Discount', -discount]] : []),
              ...(deliveryFee > 0 ? [['Delivery', deliveryFee]] : []),
            ].map(([label, amount], i) => (
              <Row key={i}>
                <Column><Text style={{ margin: '2px 0', fontSize: 13, color: '#666' }}>{label}</Text></Column>
                <Column style={{ textAlign: 'right' }}>
                  <Text style={{ margin: '2px 0', fontSize: 13, color: Number(amount) < 0 ? '#1D9E75' : '#666' }}>
                    {Number(amount) < 0 ? '-' : ''}PKR {Math.abs(Number(amount)).toLocaleString()}
                  </Text>
                </Column>
              </Row>
            ))}
            <Row>
              <Column><Text style={{ margin: '4px 0', fontSize: 16, fontWeight: 700, color: '#2C2C2A' }}>Total</Text></Column>
              <Column style={{ textAlign: 'right' }}>
                <Text style={{ margin: '4px 0', fontSize: 16, fontWeight: 700, color: '#D85A30' }}>PKR {total.toLocaleString()}</Text>
              </Column>
            </Row>

            <Button
              href={trackUrl}
              style={{ display: 'block', textAlign: 'center', backgroundColor: '#D85A30', color: '#fff', fontWeight: 600, padding: '14px 32px', borderRadius: 12, textDecoration: 'none', fontSize: 15, marginTop: 24 }}
            >
              Track Your Order
            </Button>
          </Section>

          {/* Footer */}
          <Section style={{ backgroundColor: '#2C2C2A', padding: '20px 40px', textAlign: 'center' }}>
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, margin: 0 }}>
              45 MM Alam Road, Gulberg III, Lahore · +92 42 3576 1234
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: '8px 0 0' }}>
              © {new Date().getFullYear()} Spice Garden Restaurant
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default OrderConfirmation
