import type { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import { LogWasteClient, type WasteEntry } from './client'

export const metadata: Metadata = { title: 'Log Waste' }

export default async function LogWastePage() {
  const [{ data: items, error: itemErr }, { data: logs, error: logErr }] =
    await Promise.all([
      supabaseAdmin.from('inventory_items').select('id, name, unit').order('name'),
      supabaseAdmin
        .from('waste_log')
        .select('id, quantity, reason, notes, logged_at, inventory_items(name, unit)')
        .order('logged_at', { ascending: false })
        .limit(20),
    ])

  if (itemErr) console.error('[log-waste] items error:', itemErr.message)
  if (logErr) console.error('[log-waste] logs error:', logErr.message)

  return (
    <LogWasteClient
      inventoryItems={items ?? []}
      logs={(logs ?? []) as unknown as WasteEntry[]}
    />
  )
}
