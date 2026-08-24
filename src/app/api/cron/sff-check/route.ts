import { NextResponse } from 'next/server'
import { getSFFEvents } from '@/lib/sff'

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret) {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const events = await getSFFEvents()

  return NextResponse.json({
    ok: true,
    checkedAt: new Date().toISOString(),
    eventCount: events.length,
  })
}
