import { Package, AlertTriangle, DollarSign } from 'lucide-react'
import { supabaseAdmin } from '@/lib/supabase'

export default async function DashboardPage() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const startOfMonth = `${year}-${String(month).padStart(2, '0')}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const endOfMonth = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
  const startOfMonthISO = new Date(year, month - 1, 1).toISOString()
  const startOfNextMonthISO = new Date(year, month, 1).toISOString()

  const [
    { count: ingredientCount },
    { data: stockData },
    { data: expenseData },
    { data: wasteData },
  ] = await Promise.all([
    supabaseAdmin
      .from('ingredients')
      .select('*', { count: 'exact', head: true }),
    supabaseAdmin
      .from('stock_levels')
      .select('quantity, reorder_threshold'),
    supabaseAdmin
      .from('expenses')
      .select('amount')
      .gte('date', startOfMonth)
      .lte('date', endOfMonth),
    supabaseAdmin
      .from('waste_log')
      .select('quantity')
      .gte('logged_at', startOfMonthISO)
      .lt('logged_at', startOfNextMonthISO),
  ])

  const lowStockCount = (stockData ?? []).filter(
    (s) => s.reorder_threshold > 0 && s.quantity <= s.reorder_threshold
  ).length

  const monthlyExpenses = (expenseData ?? []).reduce((sum, e) => sum + e.amount, 0)
  const monthlyWaste = (wasteData ?? []).reduce((sum, w) => sum + w.quantity, 0)

  const stats = [
    {
      label: 'Total Ingredients',
      value: ingredientCount ?? 0,
      icon: Package,
      description: 'Items tracked in inventory',
    },
    {
      label: 'Low Stock Items',
      value: lowStockCount,
      icon: AlertTriangle,
      description: 'Below minimum threshold',
    },
    {
      label: 'This Month Expenses',
      value: `$${monthlyExpenses.toFixed(2)}`,
      icon: DollarSign,
      description: 'Total spend so far',
    },
    {
      label: 'Total Waste This Month',
      value: Number(monthlyWaste.toFixed(1)),
      icon: AlertTriangle,
      description: 'Units logged as waste',
    },
  ]

  return (
    <div className="p-6 md:p-10">
      <h1 className="font-display text-3xl uppercase tracking-wide text-admin-navy mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map(({ label, value, icon: Icon, description }) => (
          <div
            key={label}
            className="bg-white rounded-xl p-6 flex flex-col gap-4 md:gap-2 shadow-sm border border-black/5"
          >
            <div className="flex items-center justify-between">
              <p className="text-admin-navy font-display uppercase tracking-wide text-sm">
                {label}
              </p>
              <div className="bg-off-white rounded-lg p-2">
                <Icon size={18} className="text-admin-navy/50" />
              </div>
            </div>
            <p className="font-mono text-4xl font-bold text-[#1B3A5C] md:text-right">
              {value}
            </p>
            <p className="text-light-gray text-xs font-sans md:text-right">{description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
