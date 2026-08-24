import { Package, AlertTriangle, DollarSign, Clock } from 'lucide-react'
import { supabaseAdmin } from '@/lib/supabase'

function formatHours(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  return `${h}h ${m}m`
}

export default async function DashboardPage() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const startOfMonth = `${year}-${String(month).padStart(2, '0')}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const endOfMonth = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
  const startOfMonthISO = new Date(year, month - 1, 1).toISOString()
  const startOfNextMonthISO = new Date(year, month, 1).toISOString()

  // Monday of current week
  const day = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1))
  monday.setHours(0, 0, 0, 0)

  const [
    { count: inventoryCount },
    { data: stockData },
    { data: expenseData },
    { data: wasteData },
    { data: shiftData },
  ] = await Promise.all([
    supabaseAdmin
      .from('inventory_items')
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
    supabaseAdmin
      .from('shifts')
      .select('staff_name, total_minutes')
      .gte('shift_start', monday.toISOString())
      .not('shift_end', 'is', null),
  ])

  const lowStockCount = (stockData ?? []).filter(
    (s) => s.reorder_threshold > 0 && s.quantity <= s.reorder_threshold
  ).length

  const monthlyExpenses = (expenseData ?? []).reduce((sum, e) => sum + e.amount, 0)
  const monthlyWaste = (wasteData ?? []).reduce((sum, w) => sum + w.quantity, 0)

  // Sum total_minutes per staff member, then average across all staff
  const staffTotals: Record<string, number> = {}
  for (const shift of shiftData ?? []) {
    if (shift.total_minutes) {
      staffTotals[shift.staff_name] = (staffTotals[shift.staff_name] ?? 0) + shift.total_minutes
    }
  }
  const staffCount = Object.keys(staffTotals).length
  const avgMinutes = staffCount > 0
    ? Object.values(staffTotals).reduce((a, b) => a + b, 0) / staffCount
    : 0

  const stats = [
    {
      label: 'Inventory Items',
      value: inventoryCount ?? 0,
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
    {
      label: 'Avg Hours This Week',
      value: formatHours(avgMinutes),
      icon: Clock,
      description: 'Per staff member',
    },
  ]

  return (
    <div className="p-4 md:p-10">
      <h1 className="font-display text-2xl sm:text-3xl uppercase tracking-wide text-admin-navy mb-6 sm:mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
        {stats.map(({ label, value, icon: Icon, description }) => (
          <div
            key={label}
            className="bg-white rounded-xl p-3 sm:p-6 flex flex-col gap-2 shadow-sm border border-black/5"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-admin-navy font-display uppercase tracking-wide text-[10px] sm:text-sm leading-tight">
                {label}
              </p>
              <div className="bg-off-white rounded-lg p-1.5 sm:p-2 flex-shrink-0">
                <Icon size={14} className="text-admin-navy/50 sm:hidden" />
                <Icon size={18} className="text-admin-navy/50 hidden sm:block" />
              </div>
            </div>
            <p className="font-mono text-xl sm:text-4xl font-bold text-[#1B3A5C]">
              {value}
            </p>
            <p className="text-light-gray text-[10px] sm:text-xs font-sans">{description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
