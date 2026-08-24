'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdminSession } from '@/lib/admin-auth'

type SupabaseActionError = {
  code?: string
  message?: string
}

function revalidate() {
  revalidatePath('/admin/purchase-orders')
  revalidatePath('/admin/stock')
}

function isMissingRpc(error: SupabaseActionError | null) {
  return error?.code === 'PGRST202'
}

async function fallbackAddItemsToStock(
  items: Array<{ inventory_item_id: string; quantity: number }>
) {
  for (const item of items) {
    const { data: stock } = await supabaseAdmin
      .from('stock_levels')
      .select('quantity')
      .eq('inventory_item_id', item.inventory_item_id)
      .single()

    if (stock) {
      const { error } = await supabaseAdmin
        .from('stock_levels')
        .update({
          quantity: stock.quantity + item.quantity,
          updated_at: new Date().toISOString(),
        })
        .eq('inventory_item_id', item.inventory_item_id)

      if (error) throw new Error(error.message)
    }
  }
}

export async function createOrder(data: {
  supplier: string
  status: string
  notes: string | null
  items: Array<{ inventory_item_id: string; quantity: number; unit_cost: number }>
}) {
  await requireAdminSession()

  const { supplier, status, notes, items } = data

  const { error } = await supabaseAdmin.rpc('admin_create_purchase_order', {
    p_supplier: supplier,
    p_status: status,
    p_notes: notes,
    p_items: items,
  })

  if (error && !isMissingRpc(error)) throw new Error(error.message)

  if (error) {
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
      await fallbackAddItemsToStock(items)
    }
  }

  revalidate()
}

export async function updateOrderStatus(id: string, newStatus: string) {
  await requireAdminSession()

  const { error } = await supabaseAdmin.rpc(
    'admin_update_purchase_order_status',
    {
      p_id: id,
      p_status: newStatus,
    }
  )

  if (error && !isMissingRpc(error)) throw new Error(error.message)

  if (error) {
    const { data: order, error: fetchError } = await supabaseAdmin
      .from('purchase_orders')
      .select('status, purchase_order_items(inventory_item_id, quantity)')
      .eq('id', id)
      .single()

    if (fetchError) throw new Error(fetchError.message)

    if (newStatus === 'received' && order.status !== 'received') {
      await fallbackAddItemsToStock(order.purchase_order_items)
    }

    const { error: updateError } = await supabaseAdmin
      .from('purchase_orders')
      .update({ status: newStatus })
      .eq('id', id)

    if (updateError) throw new Error(updateError.message)
  }

  revalidate()
}

export async function deleteOrder(id: string) {
  await requireAdminSession()

  const { error } = await supabaseAdmin
    .from('purchase_orders')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidate()
}
