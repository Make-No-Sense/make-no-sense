'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdminSession } from '@/lib/admin-auth'

export async function logTeamMeal(formData: FormData) {
  await requireAdminSession()

  const menu_item = (formData.get('menu_item') as string).trim()
  const team_member = (formData.get('team_member') as string).trim()
  const quantity = parseFloat(formData.get('quantity') as string)
  const event_name = (formData.get('event_name') as string).trim() || null
  const notes = (formData.get('notes') as string).trim() || null

  const { error } = await supabaseAdmin
    .from('team_meals')
    .insert({ menu_item, team_member, quantity, event_name, notes })

  if (error) throw new Error(error.message)

  revalidatePath('/admin/team-meals')
}

export async function deleteTeamMeal(id: string) {
  await requireAdminSession()

  const { error } = await supabaseAdmin
    .from('team_meals')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/team-meals')
}

export async function updateTeamMeal(id: string, formData: FormData) {
  await requireAdminSession()

  const menu_item = (formData.get('menu_item') as string).trim()
  const team_member = (formData.get('team_member') as string).trim()
  const quantity = parseFloat(formData.get('quantity') as string)
  const event_name = (formData.get('event_name') as string).trim() || null
  const notes = (formData.get('notes') as string).trim() || null

  const { error } = await supabaseAdmin
    .from('team_meals')
    .update({ menu_item, team_member, quantity, event_name, notes })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/team-meals')
}
