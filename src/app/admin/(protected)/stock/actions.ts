'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase'
import { sendLowStockAlert } from '@/lib/alerts'
import { requireAdminSession } from '@/lib/admin-auth'

function shouldSendLowStockAlert(
  old_quantity: number,
  new_quantity: number,
  reorder_threshold: number
) {
  return (
    reorder_threshold > 0 &&
    old_quantity > reorder_threshold &&
    new_quantity <= reorder_threshold
  )
}

export async function updateStock(id: string, formData: FormData) {
  await requireAdminSession()

  const quantity = parseFloat(formData.get('quantity') as string)
  const reorder_threshold = parseFloat(formData.get('reorder_threshold') as string)

  const { data: before, error: beforeError } = await supabaseAdmin
    .from('stock_levels')
    .select('quantity, inventory_items(name, unit)')
    .eq('id', id)
    .single()

  if (beforeError) throw new Error(beforeError.message)

  const { error } = await supabaseAdmin
    .from('stock_levels')
    .update({ quantity, reorder_threshold, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(error.message)

  const item = before?.inventory_items as unknown as { name: string; unit: string } | null

  if (
    before &&
    item &&
    shouldSendLowStockAlert(before.quantity, quantity, reorder_threshold)
  ) {
    sendLowStockAlert(item.name, quantity, item.unit, reorder_threshold).catch(
      (err) => console.error('[alerts] low stock alert failed:', err)
    )
  }

  revalidatePath('/admin/stock')
}
