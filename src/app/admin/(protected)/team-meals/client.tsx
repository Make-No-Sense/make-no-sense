'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, X } from 'lucide-react'
import { logTeamMeal, deleteTeamMeal, updateTeamMeal } from './actions'

export type TeamMealEntry = {
  id: string
  menu_item: string
  team_member: string
  quantity: number
  event_name: string | null
  notes: string | null
  logged_at: string
}

export function TeamMealsClient({ logs }: { logs: TeamMealEntry[] }) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [editingLog, setEditingLog] = useState<TeamMealEntry | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: { currentTarget: HTMLFormElement; preventDefault(): void }) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await logTeamMeal(formData)
      formRef.current?.reset()
      router.refresh()
    })
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this team meal log? This cannot be undone.')) return
    startTransition(async () => {
      await deleteTeamMeal(id)
      router.refresh()
    })
  }

  function handleEditSubmit(e: { currentTarget: HTMLFormElement; preventDefault(): void }) {
    e.preventDefault()
    if (!editingLog) return
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await updateTeamMeal(editingLog.id, formData)
      setEditingLog(null)
      router.refresh()
    })
  }

  return (
    <div className="p-6 md:p-10 flex flex-col gap-8">
      <h1 className="font-display text-3xl uppercase tracking-wide text-[#1B3A5C]">
        Team Meals
      </h1>

      {/* ── Log form ──────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-black/5 p-6 max-w-xl mx-auto w-full">
        <p className="font-display text-xs uppercase tracking-widest text-[#1B3A5C]/50 mb-5">
          Log Team Meal
        </p>
        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">
              Team Member Name
            </label>
            <input
              name="team_member"
              type="text"
              required
              placeholder="e.g. Natoya"
              className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] placeholder:text-black/20 focus:outline-none focus:ring-2 focus:ring-[#B83232]/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">
              Menu Item
            </label>
            <input
              name="menu_item"
              type="text"
              required
              placeholder="e.g. MNS Cheeseburger, Fried Hotdog"
              className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] placeholder:text-black/20 focus:outline-none focus:ring-2 focus:ring-[#B83232]/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">
              Quantity
            </label>
            <input
              name="quantity"
              type="number"
              min="1"
              max="2"
              step="1"
              required
              defaultValue="1"
              className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] focus:outline-none focus:ring-2 focus:ring-[#B83232]/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">
              Event Name <span className="normal-case font-sans text-black/30">(optional)</span>
            </label>
            <input
              name="event_name"
              type="text"
              placeholder="e.g. Saturday Opryland"
              className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] placeholder:text-black/20 focus:outline-none focus:ring-2 focus:ring-[#B83232]/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">
              Notes <span className="normal-case font-sans text-black/30">(optional)</span>
            </label>
            <textarea
              name="notes"
              rows={2}
              placeholder="Any extra details…"
              className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] placeholder:text-black/20 focus:outline-none focus:ring-2 focus:ring-[#B83232]/40 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-1 bg-[#B83232] hover:bg-[#9a2a2a] text-white rounded-lg py-2.5 text-sm font-display uppercase tracking-wide transition-colors disabled:opacity-50"
          >
            {isPending ? 'Logging…' : 'Log Team Meal'}
          </button>
        </form>
      </div>

      {/* ── History table ─────────────────────────────────── */}
      <div>
        <p className="font-display text-xs uppercase tracking-widest text-[#1B3A5C]/50 mb-4">
          Team Meal Log
        </p>
        <div className="overflow-x-auto overflow-y-hidden rounded-xl shadow-lg border border-white/5">
          <table className="w-full text-sm" style={{ minWidth: '640px' }}>
            <thead>
              <tr style={{ background: '#12202E' }}>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/60">Date</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/60">Team Member</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/60">Menu Item</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/60">Qty</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/60">Event</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/60">Notes</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center px-6 py-16 text-white/40"
                    style={{ background: '#1B3A5C' }}
                  >
                    No team meals logged yet.
                  </td>
                </tr>
              ) : (
                logs.map((log, i) => (
                  <tr
                    key={log.id}
                    style={{ background: i % 2 === 0 ? '#1B3A5C' : '#163554' }}
                    className="border-t border-white/5"
                  >
                    <td className="px-6 py-4 text-white/60 font-mono text-xs whitespace-nowrap">
                      {new Date(log.logged_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-white font-medium">{log.team_member}</td>
                    <td className="px-6 py-4 text-white">{log.menu_item}</td>
                    <td className="px-6 py-4 text-white font-mono">{log.quantity}</td>
                    <td className="px-6 py-4 text-white/60">{log.event_name ?? '—'}</td>
                    <td className="px-6 py-4 text-white/60 max-w-[180px] truncate">{log.notes ?? '—'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingLog(log)}
                          className="p-2 rounded text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                          aria-label="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(log.id)}
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
      {editingLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-black/5">
              <h2 className="font-display text-lg uppercase tracking-wide text-[#1B3A5C]">
                Edit Team Meal
              </h2>
              <button
                onClick={() => setEditingLog(null)}
                className="p-1.5 rounded hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="px-6 py-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">
                  Team Member Name
                </label>
                <input
                  name="team_member"
                  type="text"
                  required
                  defaultValue={editingLog.team_member}
                  className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] focus:outline-none focus:ring-2 focus:ring-[#B83232]/40"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">
                  Menu Item
                </label>
                <input
                  name="menu_item"
                  type="text"
                  required
                  defaultValue={editingLog.menu_item}
                  className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] focus:outline-none focus:ring-2 focus:ring-[#B83232]/40"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">
                  Quantity
                </label>
                <input
                  name="quantity"
                  type="number"
                  min="1"
                  max="2"
                  step="1"
                  required
                  defaultValue={editingLog.quantity}
                  className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] focus:outline-none focus:ring-2 focus:ring-[#B83232]/40"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">
                  Event Name <span className="normal-case font-sans text-black/30">(optional)</span>
                </label>
                <input
                  name="event_name"
                  type="text"
                  placeholder="e.g. Saturday Opryland"
                  defaultValue={editingLog.event_name ?? ''}
                  className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] placeholder:text-black/20 focus:outline-none focus:ring-2 focus:ring-[#B83232]/40"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">
                  Notes <span className="normal-case font-sans text-black/30">(optional)</span>
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="Any extra details…"
                  defaultValue={editingLog.notes ?? ''}
                  className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] placeholder:text-black/20 focus:outline-none focus:ring-2 focus:ring-[#B83232]/40 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingLog(null)}
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
