import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  try {
    const body = await request.json()
    const { name, email, subject, message, howFound, drewToWork } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const textBody = [
      `Name: ${name}`,
      `Email: ${email}`,
      subject ? `Subject: ${subject}` : null,
      howFound ? `How they found you: ${howFound}` : null,
      drewToWork ? `What drew them to the work: ${drewToWork}` : null,
      '',
      'Message:',
      message,
    ]
      .filter((line) => line !== null)
      .join('\n')

    await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: 'aboussidan@gmail.com',
      replyTo: email,
      subject: `Contact: ${subject || 'New message'} — ${name}`,
      text: textBody,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
