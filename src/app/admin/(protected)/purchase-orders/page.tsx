import type { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import { PurchaseOrdersClient, type PurchaseOrder } from './client'

export const metadata: Metadata = { title: 'Purchase Orders' }
export const dynamic = 'force-dynamic'

export default async function PurchaseOrdersPage() {
  const [{ data: ingredients, error: ingErr }, { data: orders, error: ordErr }] =
    await Promise.all([
      supabaseAdmin.from('ingredients').select('id, name, unit').order('name'),
      supabaseAdmin
        .from('purchase_orders')
        .select('id, supplier, status, notes, total, created_at')
        .order('created_at', { ascending: false })
        .limit(50),
    ])

  if (ingErr) console.error('[purchase-orders] ingredients error:', ingErr.message)
  if (ordErr) console.error('[purchase-orders] orders error:', ordErr.message)

  // Fetch items separately — avoids deep nested select failures
  const orderIds = (orders ?? []).map((o) => o.id)
  const { data: items, error: itemsErr } = orderIds.length
    ? await supabaseAdmin
        .from('purchase_order_items')
        .select('id, order_id, ingredient_id, quantity, unit_cost, ingredients(name, unit)')
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
        ingredients: Array.isArray(i.ingredients) ? i.ingredients[0] : i.ingredients,
      })),
  })) as unknown as PurchaseOrder[]

  return (
    <PurchaseOrdersClient
      ingredients={ingredients ?? []}
      orders={enriched}
    />
  )
}
