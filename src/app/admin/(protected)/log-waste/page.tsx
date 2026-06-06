import type { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import { LogWasteClient, type WasteEntry } from './client'

export const metadata: Metadata = { title: 'Log Waste' }

export default async function LogWastePage() {
  const [{ data: ingredients, error: ingErr }, { data: logs, error: logErr }] =
    await Promise.all([
      supabaseAdmin.from('ingredients').select('id, name, unit').order('name'),
      supabaseAdmin
        .from('waste_log')
        .select('id, quantity, reason, notes, logged_at, ingredients(name, unit)')
        .order('logged_at', { ascending: false })
        .limit(20),
    ])

  if (ingErr) console.error('[log-waste] ingredients error:', ingErr.message)
  if (logErr) console.error('[log-waste] logs error:', logErr.message)

  return (
    <LogWasteClient
      ingredients={ingredients ?? []}
      logs={(logs ?? []) as unknown as WasteEntry[]}
    />
  )
}
