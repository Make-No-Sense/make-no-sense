'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase'

function revalidate() {
  revalidatePath('/admin/staff-hours')
}

export async function startShift(formData: FormData) {
  const staff_name = (formData.get('staff_name') as string).trim()

  const { error } = await supabaseAdmin
    .from('shifts')
    .insert({ staff_name, shift_start: new Date().toISOString() })

  if (error) throw new Error(error.message)

  revalidate()
}

export async function endShift(id: string) {
  const { data: shift, error: fetchError } = await supabaseAdmin
    .from('shifts')
    .select('shift_start')
    .eq('id', id)
    .single()

  if (fetchError) throw new Error(fetchError.message)

  const shift_end = new Date()
  const total_minutes = Math.round(
    (shift_end.getTime() - new Date(shift.shift_start).getTime()) / 60000
  )

  const { error } = await supabaseAdmin
    .from('shifts')
    .update({
      shift_end: shift_end.toISOString(),
      total_minutes,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidate()
}

export async function deleteShift(id: string) {
  const { error } = await supabaseAdmin
    .from('shifts')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidate()
}

export async function updateShift(id: string, formData: FormData) {
  const staff_name = (formData.get('staff_name') as string).trim()
  const shift_start = formData.get('shift_start') as string
  const shift_end = (formData.get('shift_end') as string) || null
  const notes = (formData.get('notes') as string).trim() || null

  let total_minutes: number | null = null
  if (shift_start && shift_end) {
    total_minutes = Math.round(
      (new Date(shift_end).getTime() - new Date(shift_start).getTime()) / 60000
    )
  }

  const { error } = await supabaseAdmin
    .from('shifts')
    .update({
      staff_name,
      shift_start: new Date(shift_start).toISOString(),
      ...(shift_end
        ? { shift_end: new Date(shift_end).toISOString(), total_minutes }
        : {}),
      notes,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidate()
}
