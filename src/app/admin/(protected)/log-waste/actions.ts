'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase'
import { sendLowStockAlert } from '@/lib/alerts'
import { requireAdminSession } from '@/lib/admin-auth'

type StockAdjustment = {
  old_quantity: number
  new_quantity: number
  reorder_threshold: number
  item_name: string
  item_unit: string
}

type SupabaseActionError = {
  code?: string
  message?: string
}

function revalidate() {
  revalidatePath('/admin/log-waste')
  revalidatePath('/admin/stock')
}

function isMissingRpc(error: SupabaseActionError | null) {
  return error?.code === 'PGRST202'
}

function shouldSendLowStockAlert(adjustment: StockAdjustment) {
  return (
    adjustment.reorder_threshold > 0 &&
    adjustment.old_quantity > adjustment.reorder_threshold &&
    adjustment.new_quantity <= adjustment.reorder_threshold
  )
}

async function fallbackLogWaste(
  inventory_item_id: string,
  quantity: number,
  reason: string,
  notes: string | null
) {
  const { error: logError } = await supabaseAdmin
    .from('waste_log')
    .insert({ inventory_item_id, quantity, reason, notes })

  if (logError) throw new Error(logError.message)

  const { data: stock } = await supabaseAdmin
    .from('stock_levels')
    .select('quantity, reorder_threshold')
    .eq('inventory_item_id', inventory_item_id)
    .single()

  if (!stock) return null

  const newQty = Math.max(0, stock.quantity - quantity)
  const { error: stockError } = await supabaseAdmin
    .from('stock_levels')
    .update({ quantity: newQty, updated_at: new Date().toISOString() })
    .eq('inventory_item_id', inventory_item_id)

  if (stockError) throw new Error(stockError.message)

  const { data: item } = await supabaseAdmin
    .from('inventory_items')
    .select('name, unit')
    .eq('id', inventory_item_id)
    .single()

  if (!item) return null

  return {
    old_quantity: stock.quantity,
    new_quantity: newQty,
    reorder_threshold: stock.reorder_threshold,
    item_name: item.name,
    item_unit: item.unit,
  }
}

export async function logWaste(formData: FormData) {
  await requireAdminSession()

  const inventory_item_id = formData.get('inventory_item_id') as string
  const quantity = parseFloat(formData.get('quantity') as string)
  const reason = formData.get('reason') as string
  const notes = (formData.get('notes') as string).trim() || null

  const { data: adjustment, error } = await supabaseAdmin
    .rpc('admin_log_waste', {
      p_inventory_item_id: inventory_item_id,
      p_quantity: quantity,
      p_reason: reason,
      p_notes: notes,
    })
    .single<StockAdjustment>()

  if (error && !isMissingRpc(error)) throw new Error(error.message)

  const finalAdjustment = error
    ? await fallbackLogWaste(inventory_item_id, quantity, reason, notes)
    : adjustment

  if (finalAdjustment && shouldSendLowStockAlert(finalAdjustment)) {
    sendLowStockAlert(
      finalAdjustment.item_name,
      finalAdjustment.new_quantity,
      finalAdjustment.item_unit,
      finalAdjustment.reorder_threshold
    ).catch((err) => console.error('[alerts] low stock alert failed:', err))
  }

  revalidate()
}

export async function deleteWasteLog(id: string) {
  await requireAdminSession()

  const { error } = await supabaseAdmin.rpc('admin_delete_waste_log', {
    p_id: id,
  })

  if (error && !isMissingRpc(error)) throw new Error(error.message)

  if (error) {
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
      const { error: stockError } = await supabaseAdmin
        .from('stock_levels')
        .update({
          quantity: stock.quantity + log.quantity,
          updated_at: new Date().toISOString(),
        })
        .eq('inventory_item_id', log.inventory_item_id)

      if (stockError) throw new Error(stockError.message)
    }
  }

  revalidate()
}

export async function updateWasteLog(id: string, formData: FormData) {
  await requireAdminSession()

  const newQtyWasted = parseFloat(formData.get('quantity') as string)
  const reason = formData.get('reason') as string
  const notes = (formData.get('notes') as string).trim() || null

  const { error } = await supabaseAdmin.rpc('admin_update_waste_log', {
    p_id: id,
    p_quantity: newQtyWasted,
    p_reason: reason,
    p_notes: notes,
  })

  if (error && !isMissingRpc(error)) throw new Error(error.message)

  if (error) {
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
      const newStockQty = Math.max(
        0,
        stock.quantity + oldLog.quantity - newQtyWasted
      )
      const { error: stockError } = await supabaseAdmin
        .from('stock_levels')
        .update({ quantity: newStockQty, updated_at: new Date().toISOString() })
        .eq('inventory_item_id', oldLog.inventory_item_id)

      if (stockError) throw new Error(stockError.message)
    }
  }

  revalidate()
}
