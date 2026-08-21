'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase'

export async function addItem(formData: FormData) {
  const name = formData.get('name') as string
  const item_type = formData.get('item_type') as string
  const category = formData.get('category') as string
  const unit = formData.get('unit') as string
  const cost_per_unit = parseFloat(formData.get('cost_per_unit') as string) || 0

  const { data, error } = await supabaseAdmin
    .from('inventory_items')
    .insert({ name, item_type, category, unit, cost_per_unit })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  await supabaseAdmin
    .from('stock_levels')
    .insert({ inventory_item_id: data.id, quantity: 0, reorder_threshold: 0 })

  revalidatePath('/admin/ingredients')
}

export async function updateItem(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const item_type = formData.get('item_type') as string
  const category = formData.get('category') as string
  const unit = formData.get('unit') as string
  const cost_per_unit = parseFloat(formData.get('cost_per_unit') as string) || 0

  const { error } = await supabaseAdmin
    .from('inventory_items')
    .update({ name, item_type, category, unit, cost_per_unit })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/ingredients')
}

export async function deleteItem(id: string) {
  await supabaseAdmin.from('stock_levels').delete().eq('inventory_item_id', id)

  const { error } = await supabaseAdmin
    .from('inventory_items')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/ingredients')
}
