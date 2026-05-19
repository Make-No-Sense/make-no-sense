import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { name, email, phone, message, isCatering } = body as Record<string, unknown>

  if (!name || typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }
  if (!email || typeof email !== 'string' || !email.trim()) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }
  if (!message || typeof message !== 'string' || !message.trim()) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 })
  }

  const subject = isCatering
    ? `[MNS Catering Inquiry] ${name.trim()}`
    : `[MNS Contact] ${name.trim()}`

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1A1A1A;">
      <h2 style="background:#C41E1E; color:#fff; padding:16px 24px; margin:0; font-size:18px;">
        ${isCatering ? 'Catering Inquiry' : 'New Contact Message'} — Make No Sense
      </h2>
      <div style="padding:24px; background:#f9f9f9; border:1px solid #e0e0e0;">
        ${isCatering ? '<p style="display:inline-block;background:#C41E1E;color:#fff;padding:4px 10px;font-size:12px;letter-spacing:.05em;margin:0 0 16px;">CATERING INQUIRY</p>' : ''}
        <table style="width:100%; border-collapse:collapse;">
          <tr><td style="padding:8px 0; font-weight:600; width:100px; color:#555; vertical-align:top;">Name</td><td style="padding:8px 0;">${name.trim()}</td></tr>
          <tr><td style="padding:8px 0; font-weight:600; color:#555; vertical-align:top;">Email</td><td style="padding:8px 0;"><a href="mailto:${email.trim()}" style="color:#C41E1E;">${email.trim()}</a></td></tr>
          ${phone ? `<tr><td style="padding:8px 0; font-weight:600; color:#555; vertical-align:top;">Phone</td><td style="padding:8px 0;"><a href="tel:${(phone as string).trim()}" style="color:#C41E1E;">${(phone as string).trim()}</a></td></tr>` : ''}
          <tr><td style="padding:8px 0; font-weight:600; color:#555; vertical-align:top;">Message</td><td style="padding:8px 0; white-space:pre-wrap;">${message.trim()}</td></tr>
        </table>
      </div>
      <p style="padding:16px 24px; font-size:12px; color:#888; margin:0; background:#fff; border:1px solid #e0e0e0; border-top:none;">
        Sent via makenosense.info contact form
      </p>
    </div>
  `

  const { error } = await resend.emails.send({
    from: 'contact@makenosense.info',
    to: ['natoya@makenosense.info'],
    replyTo: email.trim() as string,
    subject,
    html,
  })

  if (error) {
    console.error('[contact] Resend error:', error)
    return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
