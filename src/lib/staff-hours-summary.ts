import { Resend } from 'resend'
import { supabaseAdmin } from './supabase'

const resend = new Resend(process.env.RESEND_API_KEY)
const TIME_ZONE = 'America/Chicago'

type ShiftSummaryRow = {
  staff_name: string
  shift_start: string
  total_minutes: number | null
}

type StaffTotal = {
  name: string
  minutes: number
}

function getZonedParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, Number(part.value)])
  )

  return {
    year: values.year,
    month: values.month,
    day: values.day,
    hour: values.hour,
    minute: values.minute,
    second: values.second,
  }
}

function getTimeZoneOffsetMs(date: Date) {
  const parts = getZonedParts(date)
  const zonedAsUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second
  )

  return zonedAsUtc - date.getTime()
}

function zonedDateTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0
) {
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, second))
  const firstPass = new Date(utcGuess.getTime() - getTimeZoneOffsetMs(utcGuess))
  return new Date(utcGuess.getTime() - getTimeZoneOffsetMs(firstPass))
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setUTCDate(next.getUTCDate() + days)
  return next
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    timeZone: TIME_ZONE,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatHours(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

function getPreviousWeekRange(referenceDate = new Date()) {
  const parts = getZonedParts(referenceDate)
  const localDate = new Date(Date.UTC(parts.year, parts.month - 1, parts.day))
  const day = localDate.getUTCDay()
  const daysSinceMonday = day === 0 ? 6 : day - 1

  const currentMondayLocal = addDays(localDate, -daysSinceMonday)
  const previousMondayLocal = addDays(currentMondayLocal, -7)

  const currentMonday = zonedDateTimeToUtc(
    currentMondayLocal.getUTCFullYear(),
    currentMondayLocal.getUTCMonth() + 1,
    currentMondayLocal.getUTCDate()
  )
  const previousMonday = zonedDateTimeToUtc(
    previousMondayLocal.getUTCFullYear(),
    previousMondayLocal.getUTCMonth() + 1,
    previousMondayLocal.getUTCDate()
  )

  return { start: previousMonday, end: currentMonday }
}

function getStaffTotals(shifts: ShiftSummaryRow[]) {
  const totals = new Map<string, StaffTotal>()

  for (const shift of shifts) {
    const name = shift.staff_name.trim()
    const key = name.toLowerCase()
    const minutes = Math.max(0, shift.total_minutes ?? 0)
    const current = totals.get(key)

    if (current) {
      current.minutes += minutes
    } else {
      totals.set(key, { name, minutes })
    }
  }

  return [...totals.values()].sort((a, b) => a.name.localeCompare(b.name))
}

function buildSummaryHtml(totals: StaffTotal[], start: Date, end: Date) {
  const totalMinutes = totals.reduce((sum, staff) => sum + staff.minutes, 0)
  const rows = totals
    .map(
      (staff) => `
        <tr style="border-bottom:1px solid #e5e2dc;">
          <td style="padding:12px 16px; font-size:13px; color:#1A1A1A;">
            ${staff.name}
          </td>
          <td style="padding:12px 16px; font-size:13px; font-weight:700; color:#1B3A5C; text-align:right; font-family:monospace;">
            ${formatHours(staff.minutes)}
          </td>
        </tr>
      `
    )
    .join('')

  return `
    <div style="font-family:sans-serif; max-width:560px; margin:0 auto; color:#1A1A1A;">
      <div style="background:#1B3A5C; padding:20px 28px; border-bottom:3px solid #B83232;">
        <p style="margin:0; font-size:18px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#ffffff;">
          Make No Sense
        </p>
        <p style="margin:4px 0 0; font-size:12px; color:rgba(255,255,255,0.5); letter-spacing:.06em; text-transform:uppercase;">
          Weekly Staff Hours
        </p>
      </div>

      <div style="padding:32px 28px; background:#f9f8f6; border:1px solid #e5e2dc; border-top:none;">
        <p style="display:inline-block; background:#B83232; color:#fff; font-size:11px; font-weight:700;
                  letter-spacing:.08em; text-transform:uppercase; padding:4px 10px; margin:0 0 20px; border-radius:4px;">
          Staff Hours Summary
        </p>

        <h1 style="margin:0 0 8px; font-size:24px; font-weight:700; color:#1B3A5C;">
          ${formatDate(start)} - ${formatDate(addDays(end, -1))}
        </h1>
        <p style="margin:0 0 28px; font-size:14px; color:#666;">
          Total team hours: <strong>${formatHours(totalMinutes)}</strong>
        </p>

        <table style="width:100%; border-collapse:collapse; background:#fff;
                      border:1px solid #e5e2dc; border-radius:8px; overflow:hidden;">
          <tr style="background:#1B3A5C;">
            <th style="padding:10px 16px; text-align:left; font-size:11px; font-weight:700;
                       letter-spacing:.08em; text-transform:uppercase; color:rgba(255,255,255,0.6);">
              Staff Member
            </th>
            <th style="padding:10px 16px; text-align:right; font-size:11px; font-weight:700;
                       letter-spacing:.08em; text-transform:uppercase; color:rgba(255,255,255,0.6);">
              Hours
            </th>
          </tr>
          ${
            rows ||
            `<tr><td colspan="2" style="padding:24px 16px; text-align:center; color:#888; font-size:13px;">No completed shifts this week.</td></tr>`
          }
        </table>
      </div>

      <div style="padding:16px 28px; background:#fff; border:1px solid #e5e2dc; border-top:none;">
        <a href="https://makenosense.info/admin/staff-hours"
           style="font-size:12px; color:#B83232; text-decoration:none; font-weight:600;">
          View Staff Hours
        </a>
      </div>
    </div>
  `
}

export async function sendWeeklyStaffHoursSummary() {
  const { start, end } = getPreviousWeekRange()

  const { data, error } = await supabaseAdmin
    .from('shifts')
    .select('staff_name, shift_start, total_minutes')
    .not('shift_end', 'is', null)
    .gte('shift_start', start.toISOString())
    .lt('shift_start', end.toISOString())

  if (error) throw new Error(error.message)

  const totals = getStaffTotals((data ?? []) as ShiftSummaryRow[])
  const html = buildSummaryHtml(totals, start, end)

  await resend.emails.send({
    from: 'alerts@makenosense.info',
    to: ['natoya@makenosense.info'],
    subject: `Weekly Staff Hours - ${formatDate(start)} to ${formatDate(addDays(end, -1))}`,
    html,
  })

  return {
    start: start.toISOString(),
    end: end.toISOString(),
    staffCount: totals.length,
    totalMinutes: totals.reduce((sum, staff) => sum + staff.minutes, 0),
  }
}
