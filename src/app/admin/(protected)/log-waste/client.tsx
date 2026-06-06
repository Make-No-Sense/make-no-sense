'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, X } from 'lucide-react'
import { logWaste, deleteWasteLog, updateWasteLog } from './actions'

type Ingredient = {
  id: string
  name: string
  unit: string
}

export type WasteEntry = {
  id: string
  quantity: number
  reason: string
  notes: string | null
  logged_at: string
  ingredients: { name: string; unit: string }
}

const REASONS = ['spoiled', 'dropped', 'overcooked', 'expired', 'other'] as const

export function LogWasteClient({
  ingredients,
  logs,
}: {
  ingredients: Ingredient[]
  logs: WasteEntry[]
}) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [selectedId, setSelectedId] = useState('')
  const [editingLog, setEditingLog] = useState<WasteEntry | null>(null)
  const [isPending, startTransition] = useTransition()

  const selectedIngredient = ingredients.find((i) => i.id === selectedId)

  function handleSubmit(e: { currentTarget: HTMLFormElement; preventDefault(): void }) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await logWaste(formData)
      formRef.current?.reset()
      setSelectedId('')
      router.refresh()
    })
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this waste log? This cannot be undone.')) return
    startTransition(async () => {
      await deleteWasteLog(id)
      router.refresh()
    })
  }

  function handleEditSubmit(e: { currentTarget: HTMLFormElement; preventDefault(): void }) {
    e.preventDefault()
    if (!editingLog) return
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await updateWasteLog(editingLog.id, formData)
      setEditingLog(null)
      router.refresh()
    })
  }

  return (
    <div className="p-6 md:p-10 flex flex-col gap-8">
      <h1 className="font-display text-3xl uppercase tracking-wide text-[#1B3A5C]">
        Log Waste
      </h1>

      {/* ── Log form ──────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-black/5 p-6 max-w-xl mx-auto w-full">
        <p className="font-display text-xs uppercase tracking-widest text-[#1B3A5C]/50 mb-5">
          Log New Waste
        </p>
        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">
              Ingredient
            </label>
            <select
              name="ingredient_id"
              required
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] focus:outline-none focus:ring-2 focus:ring-[#B83232]/40 bg-white"
            >
              <option value="" disabled>Select an ingredient</option>
              {ingredients.map((ing) => (
                <option key={ing.id} value={ing.id}>{ing.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">
              Quantity Wasted{selectedIngredient ? ` (${selectedIngredient.unit})` : ''}
            </label>
            <input
              name="quantity"
              type="number"
              min="0.01"
              step="0.01"
              required
              placeholder="0.00"
              className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] placeholder:text-black/20 focus:outline-none focus:ring-2 focus:ring-[#B83232]/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">
              Reason
            </label>
            <select
              name="reason"
              required
              defaultValue=""
              className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] focus:outline-none focus:ring-2 focus:ring-[#B83232]/40 bg-white"
            >
              <option value="" disabled>Select a reason</option>
              {REASONS.map((r) => (
                <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
              ))}
            </select>
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
            {isPending ? 'Logging…' : 'Log Waste'}
          </button>
        </form>
      </div>

      {/* ── History table ─────────────────────────────────── */}
      <div>
        <p className="font-display text-xs uppercase tracking-widest text-[#1B3A5C]/50 mb-4">
          Recent Waste
        </p>
        <div className="overflow-x-auto overflow-y-hidden rounded-xl shadow-lg border border-white/5">
          <table className="w-full text-sm" style={{ minWidth: '620px' }}>
            <thead>
              <tr style={{ background: '#12202E' }}>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/60">Date</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/60">Ingredient</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/60">Qty</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/60">Reason</th>
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
                    No waste logged yet.
                  </td>
                </tr>
              ) : (
                logs.map((log, i) => (
                  <tr
                    key={log.id}
                    style={{ background: i % 2 === 0 ? '#1B3A5C' : '#163554' }}
                    className="border-t border-white/5 transition-all hover:brightness-125"
                  >
                    <td className="px-6 py-4 text-white/60 font-mono text-xs">
                      {new Date(log.logged_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-white font-medium">{log.ingredients.name}</td>
                    <td className="px-6 py-4 text-white font-mono">{log.quantity}</td>
                    <td className="px-6 py-4 text-white/60 capitalize">{log.reason}</td>
                    <td className="px-6 py-4 text-white/60 max-w-[200px] truncate">{log.notes ?? '—'}</td>
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
              <div>
                <h2 className="font-display text-lg uppercase tracking-wide text-[#1B3A5C]">
                  Edit Waste Log
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">{editingLog.ingredients.name}</p>
              </div>
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
                  Quantity Wasted ({editingLog.ingredients.unit})
                </label>
                <input
                  name="quantity"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  defaultValue={editingLog.quantity}
                  className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] focus:outline-none focus:ring-2 focus:ring-[#B83232]/40"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">
                  Reason
                </label>
                <select
                  name="reason"
                  required
                  defaultValue={editingLog.reason}
                  className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] focus:outline-none focus:ring-2 focus:ring-[#B83232]/40 bg-white"
                >
                  {REASONS.map((r) => (
                    <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                  ))}
                </select>
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
