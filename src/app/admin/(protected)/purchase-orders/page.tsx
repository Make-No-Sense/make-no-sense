import type { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import { PurchaseOrdersClient, type PurchaseOrder } from './client'

export const metadata: Metadata = { title: 'Purchase Orders' }
export const dynamic = 'force-dynamic'

export default async function PurchaseOrdersPage() {
  const [{ data: inventoryItems, error: invErr }, { data: orders, error: ordErr }] =
    await Promise.all([
      supabaseAdmin.from('inventory_items').select('id, name, unit').order('name'),
      supabaseAdmin
        .from('purchase_orders')
        .select('id, supplier, status, notes, total, created_at')
        .order('created_at', { ascending: false })
        .limit(50),
    ])

  if (invErr) console.error('[purchase-orders] inventory items error:', invErr.message)
  if (ordErr) console.error('[purchase-orders] orders error:', ordErr.message)

  // Fetch items separately — avoids deep nested select failures
  const orderIds = (orders ?? []).map((o) => o.id)
  const { data: items, error: itemsErr } = orderIds.length
    ? await supabaseAdmin
        .from('purchase_order_items')
        .select('id, order_id, inventory_item_id, quantity, unit_cost, inventory_items(name, unit)')
        .in('order_id', orderIds)
    : { data: [], error: null }

  if (itemsErr) console.error('[purchase-orders] items error:', itemsErr.message)

  // Merge items onto their parent orders
  const enriched: PurchaseOrder[] = (orders ?? []).map((order) => ({
    ...order,
    purchase_order_items: (items ?? [])
      .filter((i) => i.order_id === order.id)
      .map((i) => ({
        ...i,
        inventory_items: Array.isArray(i.inventory_items) ? i.inventory_items[0] : i.inventory_items,
      })),
  })) as unknown as PurchaseOrder[]

  return (
    <PurchaseOrdersClient
      inventoryItems={inventoryItems ?? []}
      orders={enriched}
    />
  )
}
