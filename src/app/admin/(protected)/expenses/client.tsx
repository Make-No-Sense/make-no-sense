'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, X, Calendar, TrendingUp } from 'lucide-react'
import { addExpense, deleteExpense, updateExpense } from './actions'

export type Expense = {
  id: string
  category: string
  description: string
  amount: number
  date: string
}

const CATEGORIES = [
  { value: 'ingredients', label: 'Ingredients' },
  { value: 'fuel',        label: 'Fuel' },
  { value: 'generator',   label: 'Generator' },
  { value: 'equipment',   label: 'Equipment' },
  { value: 'event_fee',   label: 'Event Fee' },
  { value: 'other',       label: 'Other' },
]

function today() {
  return new Date().toISOString().split('T')[0]
}

function fmt(amount: number) {
  return `$${amount.toFixed(2)}`
}

function formatDate(dateStr: string) {
  // date is YYYY-MM-DD — parse without timezone conversion
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function ExpensesClient({
  expenses,
  thisMonth,
  thisQuarter,
}: {
  expenses: Expense[]
  thisMonth: number
  thisQuarter: number
}) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: { currentTarget: HTMLFormElement; preventDefault(): void }) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await addExpense(formData)
      formRef.current?.reset()
      router.refresh()
    })
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this expense? This cannot be undone.')) return
    startTransition(async () => {
      await deleteExpense(id)
      router.refresh()
    })
  }

  function handleEditSubmit(e: { currentTarget: HTMLFormElement; preventDefault(): void }) {
    e.preventDefault()
    if (!editingExpense) return
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await updateExpense(editingExpense.id, formData)
      setEditingExpense(null)
      router.refresh()
    })
  }

  return (
    <div className="p-6 md:p-10 flex flex-col gap-8">
      <h1 className="font-display text-3xl uppercase tracking-wide text-[#1B3A5C]">
        Expenses
      </h1>

      {/* ── Summary cards ────────────────────────────────── */}
      <div className="flex flex-wrap gap-4 justify-end">
        <div
          className="relative w-64 rounded-xl shadow-lg overflow-hidden p-5"
          style={{ background: '#1B3A5C', borderTop: '3px solid #B83232' }}
        >
          <Calendar size={24} className="absolute top-3 right-3 text-white opacity-30" />
          <p className="font-display text-xs uppercase tracking-widest text-white/50 mb-2 pr-10">
            This Month
          </p>
          <p className="font-mono text-2xl font-bold text-white">{fmt(thisMonth)}</p>
        </div>
        <div
          className="relative w-64 rounded-xl shadow-lg overflow-hidden p-5"
          style={{ background: '#1B3A5C', borderTop: '3px solid #B83232' }}
        >
          <TrendingUp size={24} className="absolute top-3 right-3 text-white opacity-30" />
          <p className="font-display text-xs uppercase tracking-widest text-white/50 mb-2 pr-10">
            This Quarter
          </p>
          <p className="font-mono text-2xl font-bold text-white">{fmt(thisQuarter)}</p>
        </div>
      </div>

      {/* ── Add expense form ──────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-black/5 p-6 max-w-xl mx-auto w-full">
        <p className="font-display text-xs uppercase tracking-widest text-[#1B3A5C]/50 mb-5">
          Add Expense
        </p>
        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">
                Category
              </label>
              <select
                name="category"
                required
                defaultValue=""
                className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] focus:outline-none focus:ring-2 focus:ring-[#B83232]/40 bg-white"
              >
                <option value="" disabled>Select</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">
                Date
              </label>
              <input
                name="date"
                type="date"
                required
                defaultValue={today()}
                className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] focus:outline-none focus:ring-2 focus:ring-[#B83232]/40"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">
              Description
            </label>
            <input
              name="description"
              type="text"
              required
              placeholder="e.g. Gas fill up, Sam's Club run"
              className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] placeholder:text-black/20 focus:outline-none focus:ring-2 focus:ring-[#B83232]/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">
              Amount ($)
            </label>
            <input
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              required
              placeholder="0.00"
              className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] placeholder:text-black/20 focus:outline-none focus:ring-2 focus:ring-[#B83232]/40"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-1 bg-[#B83232] hover:bg-[#9a2a2a] text-white rounded-lg py-2.5 text-sm font-display uppercase tracking-wide transition-colors disabled:opacity-50"
          >
            {isPending ? 'Saving…' : 'Add Expense'}
          </button>
        </form>
      </div>

      {/* ── Expenses table ────────────────────────────────── */}
      <div>
        <p className="font-display text-xs uppercase tracking-widest text-[#1B3A5C]/50 mb-4">
          Recent Expenses
        </p>
        <div className="rounded-xl overflow-hidden shadow-lg border border-white/5">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#12202E' }}>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/60">Date</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/60">Category</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/60">Description</th>
                <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/60">Amount</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center px-6 py-16 text-white/40"
                    style={{ background: '#1B3A5C' }}
                  >
                    No expenses recorded yet.
                  </td>
                </tr>
              ) : (
                expenses.map((exp, i) => (
                  <tr
                    key={exp.id}
                    style={{ background: i % 2 === 0 ? '#1B3A5C' : '#163554' }}
                    className="border-t border-white/5 transition-all hover:brightness-125"
                  >
                    <td className="px-6 py-4 text-white/60 font-mono text-xs whitespace-nowrap">
                      {formatDate(exp.date)}
                    </td>
                    <td className="px-6 py-4 text-white/60">
                      {CATEGORIES.find((c) => c.value === exp.category)?.label ?? exp.category}
                    </td>
                    <td className="px-6 py-4 text-white font-medium">{exp.description}</td>
                    <td className="px-6 py-4 text-white font-mono text-right">{fmt(exp.amount)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingExpense(exp)}
                          className="p-2 rounded text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                          aria-label="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(exp.id)}
                          disabled={isPending}
                          className="p-2 rounded text-white/40 hover:text-red-400 hover:bg-white/10 transition-colors disabled:opacity-30"
                          aria-label="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* ── Edit modal ────────────────────────────────────── */}
      {editingExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-black/5">
              <h2 className="font-display text-lg uppercase tracking-wide text-[#1B3A5C]">
                Edit Expense
              </h2>
              <button
                onClick={() => setEditingExpense(null)}
                className="p-1.5 rounded hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="px-6 py-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">
                    Category
                  </label>
                  <select
                    name="category"
                    required
                    defaultValue={editingExpense.category}
                    className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] focus:outline-none focus:ring-2 focus:ring-[#B83232]/40 bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">
                    Date
                  </label>
                  <input
                    name="date"
                    type="date"
                    required
                    defaultValue={editingExpense.date}
                    className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] focus:outline-none focus:ring-2 focus:ring-[#B83232]/40"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">
                  Description
                </label>
                <input
                  name="description"
                  type="text"
                  required
                  defaultValue={editingExpense.description}
                  className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] focus:outline-none focus:ring-2 focus:ring-[#B83232]/40"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">
                  Amount ($)
                </label>
                <input
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  defaultValue={editingExpense.amount}
                  className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] focus:outline-none focus:ring-2 focus:ring-[#B83232]/40"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingExpense(null)}
                  className="flex-1 border border-black/10 text-gray-400 rounded-lg py-2 text-sm font-display uppercase tracking-wide hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-[#B83232] hover:bg-[#9a2a2a] text-white rounded-lg py-2 text-sm font-display uppercase tracking-wide transition-colors disabled:opacity-50"
                >
                  {isPending ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
