import {
  Html, Head, Body, Container, Section, Row, Column,
  Heading, Text, Button, Hr, Preview,
} from '@react-email/components'

interface BookingConfirmationProps {
  bookingRef: string
  customerName: string
  date: string
  time: string
  partySize: number
  notes?: string
}

export function BookingConfirmation({
  bookingRef, customerName, date, time, partySize, notes,
}: BookingConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>Your table is booked at Spice Garden — Ref #{bookingRef}</Preview>
      <Body style={{ backgroundColor: '#FAFAF8', fontFamily: 'Inter, sans-serif' }}>
        <Container style={{ maxWidth: 560, margin: '40px auto', backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <Section style={{ backgroundColor: '#D85A30', padding: '32px 40px', textAlign: 'center' }}>
            <Heading style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: 0 }}>Spice Garden</Heading>
            <Text style={{ color: 'rgba(255,255,255,0.85)', margin: '8px 0 0', fontSize: 14 }}>Table Reservation Confirmed</Text>
          </Section>

          <Section style={{ padding: '32px 40px' }}>
            <Heading as="h2" style={{ fontSize: 22, fontWeight: 600, color: '#2C2C2A', marginTop: 0 }}>
              Your table is ready! 🍽️
            </Heading>
            <Text style={{ color: '#666', fontSize: 15, lineHeight: 1.6 }}>
              Hi {customerName}, your reservation at Spice Garden has been confirmed. We look forward to welcoming you!
            </Text>

            <Section style={{ backgroundColor: '#FDF2EE', borderRadius: 12, padding: '20px 24px', margin: '20px 0' }}>
              <Row style={{ marginBottom: 12 }}>
                <Column style={{ width: 120 }}>
                  <Text style={{ margin: 0, fontSize: 12, color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reference</Text>
                </Column>
                <Column>
                  <Text style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#D85A30', fontFamily: 'monospace' }}>#{bookingRef}</Text>
                </Column>
              </Row>
              <Row style={{ marginBottom: 12 }}>
                <Column style={{ width: 120 }}>
                  <Text style={{ margin: 0, fontSize: 12, color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</Text>
                </Column>
                <Column>
                  <Text style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#2C2C2A' }}>{date}</Text>
                </Column>
              </Row>
              <Row style={{ marginBottom: 12 }}>
                <Column style={{ width: 120 }}>
                  <Text style={{ margin: 0, fontSize: 12, color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Time</Text>
                </Column>
                <Column>
                  <Text style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#2C2C2A' }}>{time}</Text>
                </Column>
              </Row>
              <Row>
                <Column style={{ width: 120 }}>
                  <Text style={{ margin: 0, fontSize: 12, color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Guests</Text>
                </Column>
                <Column>
                  <Text style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#2C2C2A' }}>{partySize} {partySize === 1 ? 'Guest' : 'Guests'}</Text>
                </Column>
              </Row>
              {notes && (
                <Row style={{ marginTop: 12 }}>
                  <Column>
                    <Text style={{ margin: 0, fontSize: 12, color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Special Requests</Text>
                    <Text style={{ margin: '4px 0 0', fontSize: 14, color: '#555' }}>{notes}</Text>
                  </Column>
                </Row>
              )}
            </Section>

            <Section style={{ backgroundColor: '#F9F9F8', borderRadius: 12, padding: '16px 20px', marginTop: 20 }}>
              <Text style={{ margin: 0, fontSize: 14, color: '#2C2C2A', fontWeight: 600 }}>📍 Address</Text>
              <Text style={{ margin: '4px 0 0', fontSize: 14, color: '#666' }}>45 MM Alam Road, Gulberg III, Lahore, Punjab 54000</Text>
              <Text style={{ margin: '8px 0 0', fontSize: 14, color: '#2C2C2A', fontWeight: 600 }}>📞 Phone</Text>
              <Text style={{ margin: '4px 0 0', fontSize: 14, color: '#666' }}>+92 42 3576 1234</Text>
            </Section>

            <Text style={{ fontSize: 13, color: '#999', marginTop: 20 }}>
              Need to cancel? Please call us at least 2 hours before your reservation.
            </Text>
          </Section>

          <Section style={{ backgroundColor: '#2C2C2A', padding: '20px 40px', textAlign: 'center' }}>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>
              © {new Date().getFullYear()} Spice Garden Restaurant
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default BookingConfirmation
