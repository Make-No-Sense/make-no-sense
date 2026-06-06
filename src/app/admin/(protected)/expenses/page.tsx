import type { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import { ExpensesClient, type Expense } from './client'

export const metadata: Metadata = { title: 'Expenses' }

export default async function ExpensesPage() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() // 0-indexed

  const startOfMonth = `${year}-${String(month + 1).padStart(2, '0')}-01`

  const quarterStarts = ['01-01', '04-01', '07-01', '10-01']
  const quarterEnds   = ['03-31', '06-30', '09-30', '12-31']
  const q = Math.floor(month / 3)
  const startOfQuarter = `${year}-${quarterStarts[q]}`
  const endOfQuarter   = `${year}-${quarterEnds[q]}`

  const [{ data: expenses, error }, { data: periodData }] = await Promise.all([
    supabaseAdmin
      .from('expenses')
      .select('id, category, description, amount, date')
      .order('date', { ascending: false })
      .limit(30),
    supabaseAdmin
      .from('expenses')
      .select('amount, date')
      .gte('date', startOfQuarter)
      .lte('date', endOfQuarter),
  ])

  if (error) console.error('[expenses] fetch error:', error.message)

  const thisMonth = (periodData ?? [])
    .filter((e) => e.date >= startOfMonth)
    .reduce((sum, e) => sum + e.amount, 0)

  const thisQuarter = (periodData ?? []).reduce((sum, e) => sum + e.amount, 0)

  return (
    <ExpensesClient
      expenses={(expenses ?? []) as unknown as Expense[]}
      thisMonth={thisMonth}
      thisQuarter={thisQuarter}
    />
  )
}
