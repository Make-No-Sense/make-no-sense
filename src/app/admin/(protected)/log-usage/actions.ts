'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase'

function revalidate() {
  revalidatePath('/admin/log-usage')
  revalidatePath('/admin/stock')
}

export async function logUsage(formData: FormData) {
  const ingredient_id = formData.get('ingredient_id') as string
  const quantity_used = parseFloat(formData.get('quantity_used') as string)
  const event_name = (formData.get('event_name') as string).trim() || null

  const { error: logError } = await supabaseAdmin
    .from('usage_log')
    .insert({ ingredient_id, quantity_used, event_name })

  if (logError) throw new Error(logError.message)

  // Decrement stock — floor at 0, never go negative
  const { data: stock } = await supabaseAdmin
    .from('stock_levels')
    .select('quantity')
    .eq('ingredient_id', ingredient_id)
    .single()

  if (stock) {
    const newQty = Math.max(0, stock.quantity - quantity_used)
    await supabaseAdmin
      .from('stock_levels')
      .update({ quantity: newQty, updated_at: new Date().toISOString() })
      .eq('ingredient_id', ingredient_id)
  }

  revalidate()
}

export async function deleteUsageLog(id: string) {
  const { data: log, error: fetchError } = await supabaseAdmin
    .from('usage_log')
    .select('ingredient_id, quantity_used')
    .eq('id', id)
    .single()

  if (fetchError) throw new Error(fetchError.message)

  const { error: deleteError } = await supabaseAdmin
    .from('usage_log')
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
        quantity: stock.quantity + log.quantity_used,
        updated_at: new Date().toISOString(),
      })
      .eq('ingredient_id', log.ingredient_id)
  }

  revalidate()
}

export async function updateUsageLog(id: string, formData: FormData) {
  const newQtyUsed = parseFloat(formData.get('quantity_used') as string)
  const event_name = (formData.get('event_name') as string).trim() || null

  // Fetch old values to calculate the stock delta
  const { data: oldLog, error: fetchError } = await supabaseAdmin
    .from('usage_log')
    .select('ingredient_id, quantity_used')
    .eq('id', id)
    .single()

  if (fetchError) throw new Error(fetchError.message)

  const { error: updateError } = await supabaseAdmin
    .from('usage_log')
    .update({ quantity_used: newQtyUsed, event_name })
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
      stock.quantity + oldLog.quantity_used - newQtyUsed
    )
    await supabaseAdmin
      .from('stock_levels')
      .update({ quantity: newStockQty, updated_at: new Date().toISOString() })
      .eq('ingredient_id', oldLog.ingredient_id)
  }

  revalidate()
}
