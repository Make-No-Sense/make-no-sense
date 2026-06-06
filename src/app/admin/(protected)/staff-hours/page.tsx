import type { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import { StaffHoursClient, type ActiveShift, type ShiftRecord } from './client'

export const metadata: Metadata = { title: 'Staff Hours' }
export const dynamic = 'force-dynamic'

export default async function StaffHoursPage() {
  const twoWeeksAgo = new Date()
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

  const [{ data: active, error: activeErr }, { data: history, error: histErr }] =
    await Promise.all([
      supabaseAdmin
        .from('shifts')
        .select('id, staff_name, shift_start')
        .is('shift_end', null)
        .order('shift_start', { ascending: true }),
      supabaseAdmin
        .from('shifts')
        .select('id, staff_name, shift_start, shift_end, total_minutes, notes')
        .not('shift_end', 'is', null)
        .gte('shift_start', twoWeeksAgo.toISOString())
        .order('shift_start', { ascending: false }),
    ])

  if (activeErr) console.error('[staff-hours] active error:', activeErr.message)
  if (histErr) console.error('[staff-hours] history error:', histErr.message)

  return (
    <StaffHoursClient
      activeShifts={(active ?? []) as ActiveShift[]}
      history={(history ?? []) as ShiftRecord[]}
    />
  )
}
