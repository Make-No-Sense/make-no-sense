import type { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import { LogUsageClient, type LogEntry } from './client'

export const metadata: Metadata = { title: 'Log Usage' }

export default async function LogUsagePage() {
  const [{ data: items, error: itemErr }, { data: logs, error: logErr }] =
    await Promise.all([
      supabaseAdmin.from('inventory_items').select('id, name, unit').order('name'),
      supabaseAdmin
        .from('usage_log')
        .select('id, quantity_used, event_name, logged_at, inventory_items(name, unit)')
        .order('logged_at', { ascending: false })
        .limit(20),
    ])

  if (itemErr) console.error('[log-usage] items error:', itemErr.message)
  if (logErr) console.error('[log-usage] logs error:', logErr.message)

  return (
    <LogUsageClient
      inventoryItems={items ?? []}
      logs={(logs ?? []) as unknown as LogEntry[]}
    />
  )
}
