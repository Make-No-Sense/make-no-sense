'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase'

export async function updateStock(id: string, formData: FormData) {
  const quantity = parseFloat(formData.get('quantity') as string)
  const reorder_threshold = parseFloat(formData.get('reorder_threshold') as string)

  const { error } = await supabaseAdmin
    .from('stock_levels')
    .update({ quantity, reorder_threshold, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/stock')
}
