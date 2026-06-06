import type { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import { TeamMealsClient, type TeamMealEntry } from './client'

export const metadata: Metadata = { title: 'Team Meals' }

export default async function TeamMealsPage() {
  const { data: logs, error } = await supabaseAdmin
    .from('team_meals')
    .select('id, menu_item, team_member, quantity, event_name, notes, logged_at')
    .order('logged_at', { ascending: false })
    .limit(50)

  if (error) console.error('[team-meals] fetch error:', error.message)

  return <TeamMealsClient logs={(logs ?? []) as TeamMealEntry[]} />
}
