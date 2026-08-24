import { NextResponse } from 'next/server'
import { sendWeeklyStaffHoursSummary } from '@/lib/staff-hours-summary'

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret) {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const summary = await sendWeeklyStaffHoursSummary()

  return NextResponse.json({
    ok: true,
    sentAt: new Date().toISOString(),
    ...summary,
  })
}
