'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase'
import { sendLowStockAlert } from '@/lib/alerts'

function revalidate() {
  revalidatePath('/admin/log-usage')
  revalidatePath('/admin/stock')
}

export async function logUsage(formData: FormData) {
  const inventory_item_id = formData.get('inventory_item_id') as string
  const quantity_used = parseFloat(formData.get('quantity_used') as string)
  const event_name = (formData.get('event_name') as string).trim() || null

  const { error: logError } = await supabaseAdmin
    .from('usage_log')
    .insert({ inventory_item_id, quantity_used, event_name })

  if (logError) throw new Error(logError.message)

  const { data: stock } = await supabaseAdmin
    .from('stock_levels')
    .select('quantity, reorder_threshold')
    .eq('inventory_item_id', inventory_item_id)
    .single()

  if (stock) {
    const newQty = Math.max(0, stock.quantity - quantity_used)
    await supabaseAdmin
      .from('stock_levels')
      .update({ quantity: newQty, updated_at: new Date().toISOString() })
      .eq('inventory_item_id', inventory_item_id)

    const justCrossed =
      stock.reorder_threshold > 0 &&
      stock.quantity > stock.reorder_threshold &&
      newQty <= stock.reorder_threshold

    if (justCrossed) {
      const { data: item } = await supabaseAdmin
        .from('inventory_items')
        .select('name, unit')
        .eq('id', inventory_item_id)
        .single()

      if (item) {
        sendLowStockAlert(item.name, newQty, item.unit, stock.reorder_threshold)
          .catch((err) => console.error('[alerts] low stock alert failed:', err))
      }
    }
  }

  revalidate()
}

export async function deleteUsageLog(id: string) {
  const { data: log, error: fetchError } = await supabaseAdmin
    .from('usage_log')
    .select('inventory_item_id, quantity_used')
    .eq('id', id)
    .single()

  if (fetchError) throw new Error(fetchError.message)

  const { error: deleteError } = await supabaseAdmin
    .from('usage_log')
    .delete()
    .eq('id', id)

  if (deleteError) throw new Error(deleteError.message)

  const { data: stock } = await supabaseAdmin
    .from('stock_levels')
    .select('quantity')
    .eq('inventory_item_id', log.inventory_item_id)
    .single()

  if (stock) {
    await supabaseAdmin
      .from('stock_levels')
      .update({
        quantity: stock.quantity + log.quantity_used,
        updated_at: new Date().toISOString(),
      })
      .eq('inventory_item_id', log.inventory_item_id)
  }

  revalidate()
}

export async function updateUsageLog(id: string, formData: FormData) {
  const newQtyUsed = parseFloat(formData.get('quantity_used') as string)
  const event_name = (formData.get('event_name') as string).trim() || null

  const { data: oldLog, error: fetchError } = await supabaseAdmin
    .from('usage_log')
    .select('inventory_item_id, quantity_used')
    .eq('id', id)
    .single()

  if (fetchError) throw new Error(fetchError.message)

  const { error: updateError } = await supabaseAdmin
    .from('usage_log')
    .update({ quantity_used: newQtyUsed, event_name })
    .eq('id', id)

  if (updateError) throw new Error(updateError.message)

  const { data: stock } = await supabaseAdmin
    .from('stock_levels')
    .select('quantity')
    .eq('inventory_item_id', oldLog.inventory_item_id)
    .single()

  if (stock) {
    const newStockQty = Math.max(0, stock.quantity + oldLog.quantity_used - newQtyUsed)
    await supabaseAdmin
      .from('stock_levels')
      .update({ quantity: newStockQty, updated_at: new Date().toISOString() })
      .eq('inventory_item_id', oldLog.inventory_item_id)
  }

  revalidate()
}
