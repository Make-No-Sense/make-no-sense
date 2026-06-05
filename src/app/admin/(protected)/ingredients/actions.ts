'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase'

export async function addIngredient(formData: FormData) {
  const name = formData.get('name') as string
  const category = formData.get('category') as string
  const unit = formData.get('unit') as string
  const cost_per_unit = parseFloat(formData.get('cost_per_unit') as string) || 0

  const { data, error } = await supabaseAdmin
    .from('ingredients')
    .insert({ name, category, unit, cost_per_unit })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  await supabaseAdmin
    .from('stock_levels')
    .insert({ ingredient_id: data.id, quantity: 0, reorder_threshold: 0 })

  revalidatePath('/admin/ingredients')
}

export async function updateIngredient(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const category = formData.get('category') as string
  const unit = formData.get('unit') as string
  const cost_per_unit = parseFloat(formData.get('cost_per_unit') as string) || 0

  const { error } = await supabaseAdmin
    .from('ingredients')
    .update({ name, category, unit, cost_per_unit })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/ingredients')
}

export async function deleteIngredient(id: string) {
  await supabaseAdmin.from('stock_levels').delete().eq('ingredient_id', id)

  const { error } = await supabaseAdmin
    .from('ingredients')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/ingredients')
}
