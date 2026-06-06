'use client'

import { useState, useEffect, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, X } from 'lucide-react'
import { startShift, endShift, deleteShift, updateShift } from './actions'

export type ActiveShift = {
  id: string
  staff_name: string
  shift_start: string
}

export type ShiftRecord = {
  id: string
  staff_name: string
  shift_start: string
  shift_end: string
  total_minutes: number | null
  notes: string | null
}

// ── Helpers ──────────────────────────────────────────────

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function formatTotalHours(minutes: number | null) {
  if (!minutes || minutes < 0) return '—'
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  if (h === 0) return `${m}m`
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

function toDatetimeLocal(iso: string) {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function getMondayOfCurrentWeek() {
  const now = new Date()
  const day = now.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(now)
  monday.setDate(now.getDate() + diff)
  monday.setHours(0, 0, 0, 0)
  return monday
}

// ── Active shift card with live timer ────────────────────

function ActiveShiftCard({
  shift,
  onEnd,
  disabled,
}: {
  shift: ActiveShift
  onEnd: (id: string) => void
  disabled: boolean
}) {
  const [elapsed, setElapsed] = useState('')

  useEffect(() => {
    function tick() {
      const diff = Date.now() - new Date(shift.shift_start).getTime()
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setElapsed(
        h > 0 ? `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`
               : `${m}m ${String(s).padStart(2, '0')}s`
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [shift.shift_start])

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-3"
      style={{ background: '#1B3A5C', borderTop: '3px solid #B83232' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-xs uppercase tracking-widest text-white/50 mb-1">
            Active Shift
          </p>
          <p className="font-display text-lg uppercase tracking-wide text-white">
            {shift.staff_name}
          </p>
          <p className="text-xs text-white/50 mt-0.5">
            Started {formatTime(shift.shift_start)}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-2xl font-bold text-white tabular-nums">
            {elapsed}
          </p>
        </div>
      </div>
      <button
        onClick={() => onEnd(shift.id)}
        disabled={disabled}
        className="w-full py-2 rounded-lg text-sm font-display uppercase tracking-wide transition-colors disabled:opacity-50"
        style={{ background: '#12202E', color: '#ffffff' }}
      >
        End Shift
      </button>
    </div>
  )
}

// ── Main component ────────────────────────────────────────

export function StaffHoursClient({
  activeShifts,
  history,
}: {
  activeShifts: ActiveShift[]
  history: ShiftRecord[]
}) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [range, setRange] = useState<'week' | '2weeks'>('week')
  const [editingShift, setEditingShift] = useState<ShiftRecord | null>(null)
  const [isPending, startTransition] = useTransition()

  // Client-side date filter
  const monday = getMondayOfCurrentWeek()
  const filtered =
    range === 'week'
      ? history.filter((s) => new Date(s.shift_start) >= monday)
      : history

  function handleClockIn(e: { currentTarget: HTMLFormElement; preventDefault(): void }) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await startShift(formData)
      formRef.current?.reset()
      router.refresh()
    })
  }

  function handleEndShift(id: string) {
    startTransition(async () => {
      await endShift(id)
      router.refresh()
    })
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this shift record? This cannot be undone.')) return
    startTransition(async () => {
      await deleteShift(id)
      router.refresh()
    })
  }

  function handleEditSubmit(e: { currentTarget: HTMLFormElement; preventDefault(): void }) {
    e.preventDefault()
    if (!editingShift) return
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await updateShift(editingShift.id, formData)
      setEditingShift(null)
      router.refresh()
    })
  }

  return (
    <div className="p-6 md:p-10 flex flex-col gap-10">
      <h1 className="font-display text-3xl uppercase tracking-wide text-[#1B3A5C]">
        Staff Hours
      </h1>

      {/* ── Section 1: Clock In / Clock Out ───────────────── */}
      <div className="flex flex-col gap-6">
        {/* Clock-in form */}
        <form ref={formRef} onSubmit={handleClockIn}
          className="bg-white rounded-xl shadow-sm border border-black/5 p-6 max-w-sm w-full mx-auto flex flex-col gap-4">
          <p className="font-display text-xs uppercase tracking-widest text-[#1B3A5C]/50">
            Clock In / Clock Out
          </p>
            <div className="flex flex-col gap-1.5">
              <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">
                Staff Name
              </label>
              <input
                name="staff_name"
                type="text"
                required
                placeholder="e.g. Natoya"
                className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] placeholder:text-black/20 focus:outline-none focus:ring-2 focus:ring-[#B83232]/40"
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="bg-[#B83232] hover:bg-[#9a2a2a] text-white rounded-lg py-2.5 text-sm font-display uppercase tracking-wide transition-colors disabled:opacity-50"
            >
              {isPending ? 'Starting…' : 'Start Shift'}
            </button>
          </form>

        {/* Active shift cards */}
        {activeShifts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeShifts.map((shift) => (
              <ActiveShiftCard
                key={shift.id}
                shift={shift}
                onEnd={handleEndShift}
                disabled={isPending}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Section 2: Shift History ──────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <p className="font-display text-xs uppercase tracking-widest text-[#1B3A5C]/50">
            Shift History
          </p>
          {/* Range toggle */}
          <div className="flex rounded-lg overflow-hidden border border-black/10">
            {(['week', '2weeks'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className="px-4 py-1.5 text-xs font-display uppercase tracking-wide transition-colors"
                style={{
                  background: range === r ? '#1B3A5C' : '#ffffff',
                  color: range === r ? '#ffffff' : '#1B3A5C',
                }}
              >
                {r === 'week' ? 'This Week' : 'Last 2 Weeks'}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-hidden rounded-xl shadow-lg border border-white/5">
          <table className="w-full text-sm" style={{ minWidth: '680px' }}>
            <thead>
              <tr style={{ background: '#12202E' }}>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/60">Date</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/60">Staff</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/60">Clock In</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/60">Clock Out</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/60">Total</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/60">Notes</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center px-6 py-16 text-white/40"
                    style={{ background: '#1B3A5C' }}>
                    No shifts recorded {range === 'week' ? 'this week' : 'in the last 2 weeks'}.
                  </td>
                </tr>
              ) : (
                filtered.map((shift, i) => (
                  <tr
                    key={shift.id}
                    style={{ background: i % 2 === 0 ? '#1B3A5C' : '#163554' }}
                    className="border-t border-white/5 transition-all hover:brightness-125"
                  >
                    <td className="px-6 py-4 text-white/60 font-mono text-xs whitespace-nowrap">
                      {formatDate(shift.shift_start)}
                    </td>
                    <td className="px-6 py-4 text-white font-medium">{shift.staff_name}</td>
                    <td className="px-6 py-4 text-white/80 font-mono text-xs">{formatTime(shift.shift_start)}</td>
                    <td className="px-6 py-4 text-white/80 font-mono text-xs">{formatTime(shift.shift_end)}</td>
                    <td className="px-6 py-4 text-white font-mono">{formatTotalHours(shift.total_minutes)}</td>
                    <td className="px-6 py-4 text-white/60 max-w-[160px] truncate">{shift.notes ?? '—'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingShift(shift)}
                          className="p-2 rounded text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                          aria-label="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(shift.id)}
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
      {editingShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-black/5">
              <h2 className="font-display text-lg uppercase tracking-wide text-[#1B3A5C]">
                Edit Shift
              </h2>
              <button onClick={() => setEditingShift(null)}
                className="p-1.5 rounded hover:bg-gray-100 text-gray-400 transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="px-6 py-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">
                  Staff Name
                </label>
                <input
                  name="staff_name"
                  type="text"
                  required
                  defaultValue={editingShift.staff_name}
                  className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] focus:outline-none focus:ring-2 focus:ring-[#B83232]/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">
                    Clock In
                  </label>
                  <input
                    name="shift_start"
                    type="datetime-local"
                    required
                    defaultValue={toDatetimeLocal(editingShift.shift_start)}
                    className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] focus:outline-none focus:ring-2 focus:ring-[#B83232]/40"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">
                    Clock Out
                  </label>
                  <input
                    name="shift_end"
                    type="datetime-local"
                    defaultValue={editingShift.shift_end ? toDatetimeLocal(editingShift.shift_end) : ''}
                    className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] focus:outline-none focus:ring-2 focus:ring-[#B83232]/40"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">
                  Notes <span className="normal-case font-sans text-black/30">(optional)</span>
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  defaultValue={editingShift.notes ?? ''}
                  placeholder="Any extra details…"
                  className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] placeholder:text-black/20 focus:outline-none focus:ring-2 focus:ring-[#B83232]/40 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditingShift(null)}
                  className="flex-1 border border-black/10 text-gray-400 rounded-lg py-2 text-sm font-display uppercase tracking-wide hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isPending}
                  className="flex-1 bg-[#B83232] hover:bg-[#9a2a2a] text-white rounded-lg py-2 text-sm font-display uppercase tracking-wide transition-colors disabled:opacity-50">
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
