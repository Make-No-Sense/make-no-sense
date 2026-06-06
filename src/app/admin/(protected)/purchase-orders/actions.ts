'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase'

type StockItem = { ingredient_id: string; quantity: number }

function revalidate() {
  revalidatePath('/admin/purchase-orders')
  revalidatePath('/admin/stock')
}

async function addItemsToStock(items: StockItem[]) {
  for (const item of items) {
    const { data: stock } = await supabaseAdmin
      .from('stock_levels')
      .select('quantity')
      .eq('ingredient_id', item.ingredient_id)
      .single()

    if (stock) {
      await supabaseAdmin
        .from('stock_levels')
        .update({
          quantity: stock.quantity + item.quantity,
          updated_at: new Date().toISOString(),
        })
        .eq('ingredient_id', item.ingredient_id)
    }
  }
}

export async function createOrder(data: {
  supplier: string
  status: string
  notes: string | null
  items: Array<{ ingredient_id: string; quantity: number; unit_cost: number }>
}) {
  const { supplier, status, notes, items } = data
  const total = items.reduce((sum, i) => sum + i.quantity * i.unit_cost, 0)

  const { data: order, error: orderError } = await supabaseAdmin
    .from('purchase_orders')
    .insert({ supplier, status, notes, total })
    .select('id')
    .single()

  if (orderError) throw new Error(orderError.message)

  const { error: itemsError } = await supabaseAdmin
    .from('purchase_order_items')
    .insert(items.map((i) => ({ ...i, order_id: order.id })))

  if (itemsError) throw new Error(itemsError.message)

  if (status === 'received') {
    await addItemsToStock(items)
  }

  revalidate()
}

export async function updateOrderStatus(id: string, newStatus: string) {
  const { data: order, error: fetchError } = await supabaseAdmin
    .from('purchase_orders')
    .select('status, purchase_order_items(ingredient_id, quantity)')
    .eq('id', id)
    .single()

  if (fetchError) throw new Error(fetchError.message)

  // Add stock only when transitioning INTO received for the first time
  if (newStatus === 'received' && order.status !== 'received') {
    await addItemsToStock(
      order.purchase_order_items as StockItem[]
    )
  }

  const { error } = await supabaseAdmin
    .from('purchase_orders')
    .update({ status: newStatus })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidate()
}

export async function deleteOrder(id: string) {
  const { error } = await supabaseAdmin
    .from('purchase_orders')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidate()
}
