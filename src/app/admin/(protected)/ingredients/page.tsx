import type { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import { InventoryTable } from './table'

export const metadata: Metadata = { title: 'Inventory' }

export default async function InventoryPage() {
  const { data, error } = await supabaseAdmin
    .from('inventory_items')
    .select('id, name, item_type, category, unit, cost_per_unit')
    .order('name')

  if (error) console.error('[inventory] fetch error:', error.message)

  return <InventoryTable items={data ?? []} />
}
