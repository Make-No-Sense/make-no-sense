'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase'
import { sendLowStockAlert } from '@/lib/alerts'

function revalidate() {
  revalidatePath('/admin/log-waste')
  revalidatePath('/admin/stock')
}

export async function logWaste(formData: FormData) {
  const ingredient_id = formData.get('ingredient_id') as string
  const quantity = parseFloat(formData.get('quantity') as string)
  const reason = formData.get('reason') as string
  const notes = (formData.get('notes') as string).trim() || null

  const { error: logError } = await supabaseAdmin
    .from('waste_log')
    .insert({ ingredient_id, quantity, reason, notes })

  if (logError) throw new Error(logError.message)

  // Decrement stock — floor at 0, never go negative
  const { data: stock } = await supabaseAdmin
    .from('stock_levels')
    .select('quantity, reorder_threshold')
    .eq('ingredient_id', ingredient_id)
    .single()

  if (stock) {
    const newQty = Math.max(0, stock.quantity - quantity)
    await supabaseAdmin
      .from('stock_levels')
      .update({ quantity: newQty, updated_at: new Date().toISOString() })
      .eq('ingredient_id', ingredient_id)

    // Alert only when stock just crosses below threshold (was OK, now low)
    const justCrossed =
      stock.reorder_threshold > 0 &&
      stock.quantity > stock.reorder_threshold &&
      newQty <= stock.reorder_threshold

    if (justCrossed) {
      const { data: ing } = await supabaseAdmin
        .from('ingredients')
        .select('name, unit')
        .eq('id', ingredient_id)
        .single()

      if (ing) {
        sendLowStockAlert(ing.name, newQty, ing.unit, stock.reorder_threshold)
          .catch((err) => console.error('[alerts] low stock alert failed:', err))
      }
    }
  }

  revalidate()
}

export async function deleteWasteLog(id: string) {
  const { data: log, error: fetchError } = await supabaseAdmin
    .from('waste_log')
    .select('ingredient_id, quantity')
    .eq('id', id)
    .single()

  if (fetchError) throw new Error(fetchError.message)

  const { error: deleteError } = await supabaseAdmin
    .from('waste_log')
    .delete()
    .eq('id', id)

  if (deleteError) throw new Error(deleteError.message)

  // Restore the quantity back to stock
  const { data: stock } = await supabaseAdmin
    .from('stock_levels')
    .select('quantity')
    .eq('ingredient_id', log.ingredient_id)
    .single()

  if (stock) {
    await supabaseAdmin
      .from('stock_levels')
      .update({
        quantity: stock.quantity + log.quantity,
        updated_at: new Date().toISOString(),
      })
      .eq('ingredient_id', log.ingredient_id)
  }

  revalidate()
}

export async function updateWasteLog(id: string, formData: FormData) {
  const newQtyWasted = parseFloat(formData.get('quantity') as string)
  const reason = formData.get('reason') as string
  const notes = (formData.get('notes') as string).trim() || null

  // Fetch old values to calculate the stock delta
  const { data: oldLog, error: fetchError } = await supabaseAdmin
    .from('waste_log')
    .select('ingredient_id, quantity')
    .eq('id', id)
    .single()

  if (fetchError) throw new Error(fetchError.message)

  const { error: updateError } = await supabaseAdmin
    .from('waste_log')
    .update({ quantity: newQtyWasted, reason, notes })
    .eq('id', id)

  if (updateError) throw new Error(updateError.message)

  // Adjust stock: undo the old deduction, apply the new one
  const { data: stock } = await supabaseAdmin
    .from('stock_levels')
    .select('quantity')
    .eq('ingredient_id', oldLog.ingredient_id)
    .single()

  if (stock) {
    const newStockQty = Math.max(
      0,
      stock.quantity + oldLog.quantity - newQtyWasted
    )
    await supabaseAdmin
      .from('stock_levels')
      .update({ quantity: newStockQty, updated_at: new Date().toISOString() })
      .eq('ingredient_id', oldLog.ingredient_id)
  }

  revalidate()
}
