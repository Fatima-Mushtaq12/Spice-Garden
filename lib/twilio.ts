import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export async function sendSMS(to: string, body: string) {
  if (!process.env.TWILIO_ACCOUNT_SID) {
    console.log('[SMS] Would send to', to, ':', body)
    return
  }
  return client.messages.create({
    body,
    from: process.env.TWILIO_PHONE_NUMBER!,
    to,
  })
}

export async function sendOrderConfirmationSMS(phone: string, orderId: string, total: number) {
  return sendSMS(
    phone,
    `Spice Garden: Your order #${orderId.slice(-6).toUpperCase()} (PKR ${total}) has been received! Track at: ${process.env.NEXT_PUBLIC_APP_URL}/track/${orderId}`
  )
}

export async function sendBookingConfirmationSMS(phone: string, bookingRef: string, date: string, time: string) {
  return sendSMS(
    phone,
    `Spice Garden: Your table is booked! Ref: ${bookingRef} | ${date} at ${time}. See you soon!`
  )
}
