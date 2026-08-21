import type { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import { StockTable } from './table'

export const metadata: Metadata = { title: 'Stock Levels' }

export default async function StockPage() {
  const { data, error } = await supabaseAdmin
    .from('stock_levels')
    .select('*, inventory_items(name, category, unit)')
    .order('name', { referencedTable: 'inventory_items' })

  if (error) console.error('[stock] fetch error:', error.message)

  return <StockTable rows={data ?? []} />
}
