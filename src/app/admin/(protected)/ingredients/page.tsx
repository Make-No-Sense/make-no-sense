import type { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import { IngredientTable } from './table'

export const metadata: Metadata = { title: 'Ingredients' }

export default async function IngredientsPage() {
  const { data, error } = await supabaseAdmin
    .from('ingredients')
    .select('id, name, category, unit, cost_per_unit')
    .order('name')

  if (error) console.error('[ingredients] fetch error:', error.message)

  return <IngredientTable ingredients={data ?? []} />
}
