import type { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import { LogUsageClient, type LogEntry } from './client'

export const metadata: Metadata = { title: 'Log Usage' }

export default async function LogUsagePage() {
  const [{ data: ingredients, error: ingErr }, { data: logs, error: logErr }] =
    await Promise.all([
      supabaseAdmin.from('ingredients').select('id, name, unit').order('name'),
      supabaseAdmin
        .from('usage_log')
        .select('id, quantity_used, event_name, logged_at, ingredients(name, unit)')
        .order('logged_at', { ascending: false })
        .limit(20),
    ])

  if (ingErr) console.error('[log-usage] ingredients error:', ingErr.message)
  if (logErr) console.error('[log-usage] logs error:', logErr.message)

  return (
    <LogUsageClient
      ingredients={ingredients ?? []}
      logs={(logs ?? []) as unknown as LogEntry[]}
    />
  )
}
