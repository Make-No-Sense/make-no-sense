'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdminSession } from '@/lib/admin-auth'

function revalidate() {
  revalidatePath('/admin/expenses')
}

export async function addExpense(formData: FormData) {
  await requireAdminSession()

  const category = formData.get('category') as string
  const description = (formData.get('description') as string).trim()
  const amount = parseFloat(formData.get('amount') as string)
  const date = formData.get('date') as string

  const { error } = await supabaseAdmin
    .from('expenses')
    .insert({ category, description, amount, date })

  if (error) throw new Error(error.message)

  revalidate()
}

export async function deleteExpense(id: string) {
  await requireAdminSession()

  const { error } = await supabaseAdmin
    .from('expenses')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidate()
}

export async function updateExpense(id: string, formData: FormData) {
  await requireAdminSession()

  const category = formData.get('category') as string
  const description = (formData.get('description') as string).trim()
  const amount = parseFloat(formData.get('amount') as string)
  const date = formData.get('date') as string

  const { error } = await supabaseAdmin
    .from('expenses')
    .update({ category, description, amount, date })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidate()
}
