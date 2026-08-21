'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase'
import { sendLowStockAlert } from '@/lib/alerts'

function revalidate() {
  revalidatePath('/admin/log-waste')
  revalidatePath('/admin/stock')
}

export async function logWaste(formData: FormData) {
  const inventory_item_id = formData.get('inventory_item_id') as string
  const quantity = parseFloat(formData.get('quantity') as string)
  const reason = formData.get('reason') as string
  const notes = (formData.get('notes') as string).trim() || null

  const { error: logError } = await supabaseAdmin
    .from('waste_log')
    .insert({ inventory_item_id, quantity, reason, notes })

  if (logError) throw new Error(logError.message)

  const { data: stock } = await supabaseAdmin
    .from('stock_levels')
    .select('quantity, reorder_threshold')
    .eq('inventory_item_id', inventory_item_id)
    .single()

  if (stock) {
    const newQty = Math.max(0, stock.quantity - quantity)
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

export async function deleteWasteLog(id: string) {
  const { data: log, error: fetchError } = await supabaseAdmin
    .from('waste_log')
    .select('inventory_item_id, quantity')
    .eq('id', id)
    .single()

  if (fetchError) throw new Error(fetchError.message)

  const { error: deleteError } = await supabaseAdmin
    .from('waste_log')
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
        quantity: stock.quantity + log.quantity,
        updated_at: new Date().toISOString(),
      })
      .eq('inventory_item_id', log.inventory_item_id)
  }

  revalidate()
}

export async function updateWasteLog(id: string, formData: FormData) {
  const newQtyWasted = parseFloat(formData.get('quantity') as string)
  const reason = formData.get('reason') as string
  const notes = (formData.get('notes') as string).trim() || null

  const { data: oldLog, error: fetchError } = await supabaseAdmin
    .from('waste_log')
    .select('inventory_item_id, quantity')
    .eq('id', id)
    .single()

  if (fetchError) throw new Error(fetchError.message)

  const { error: updateError } = await supabaseAdmin
    .from('waste_log')
    .update({ quantity: newQtyWasted, reason, notes })
    .eq('id', id)

  if (updateError) throw new Error(updateError.message)

  const { data: stock } = await supabaseAdmin
    .from('stock_levels')
    .select('quantity')
    .eq('inventory_item_id', oldLog.inventory_item_id)
    .single()

  if (stock) {
    const newStockQty = Math.max(0, stock.quantity + oldLog.quantity - newQtyWasted)
    await supabaseAdmin
      .from('stock_levels')
      .update({ quantity: newStockQty, updated_at: new Date().toISOString() })
      .eq('inventory_item_id', oldLog.inventory_item_id)
  }

  revalidate()
}
