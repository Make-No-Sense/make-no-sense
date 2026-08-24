'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, X } from 'lucide-react'
import { updateStock } from './actions'

type StockRow = {
  id: string
  quantity: number
  reorder_threshold: number
  updated_at: string
  inventory_item_id: string
  inventory_items: {
    name: string
    category: string | null
    unit: string
  }
}

function StatusBadge({ quantity, reorder_threshold }: { quantity: number; reorder_threshold: number }) {
  if (quantity === 0) {
    return (
      <span style={{ background: 'rgba(153,27,27,0.5)', color: '#fca5a5' }}
        className="text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap">
        Out of Stock
      </span>
    )
  }
  if (quantity <= reorder_threshold) {
    return (
      <span style={{ background: 'rgba(120,53,15,0.5)', color: '#fcd34d' }}
        className="text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap">
        Low Stock
      </span>
    )
  }
  return (
    <span style={{ background: 'rgba(20,83,45,0.5)', color: '#86efac' }}
      className="text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap">
      In Stock
    </span>
  )
}

export function StockTable({ rows }: { rows: StockRow[] }) {
  const router = useRouter()
  const [editing, setEditing] = useState<StockRow | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: { currentTarget: HTMLFormElement; preventDefault(): void }) {
    e.preventDefault()
    if (!editing) return
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await updateStock(editing.id, formData)
      setEditing(null)
      router.refresh()
    })
  }

  return (
    <div className="p-4 md:p-10">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h1 className="font-display text-2xl sm:text-3xl uppercase tracking-wide text-[#1B3A5C]">
          Stock Levels
        </h1>
      </div>

      <div className="overflow-x-auto overflow-y-hidden rounded-xl shadow-lg border border-white/5">
        <table className="w-full text-sm" style={{ minWidth: '680px' }}>
          <thead>
            <tr style={{ background: '#12202E' }}>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/60">Item</th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/60">Category</th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/60">Unit</th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/60">Qty</th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/60">Reorder At</th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/60">Status</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center px-6 py-16 text-white/40" style={{ background: '#1B3A5C' }}>
                  No stock records yet — add inventory items first.
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr
                  key={row.id}
                  style={{ background: i % 2 === 0 ? '#1B3A5C' : '#163554' }}
                  className="border-t border-white/5 transition-all hover:brightness-125"
                >
                  <td className="px-6 py-4 text-white font-medium">{row.inventory_items.name}</td>
                  <td className="px-6 py-4 text-white/60 capitalize">{row.inventory_items.category ?? '—'}</td>
                  <td className="px-6 py-4 text-white/60">{row.inventory_items.unit}</td>
                  <td className="px-6 py-4 text-white font-mono">{row.quantity}</td>
                  <td className="px-6 py-4 text-white/60 font-mono">{row.reorder_threshold}</td>
                  <td className="px-6 py-4">
                    <StatusBadge quantity={row.quantity} reorder_threshold={row.reorder_threshold} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end">
                      <button onClick={() => setEditing(row)}
                        className="p-2 rounded text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                        aria-label="Update stock">
                        <Pencil size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-black/5">
              <div>
                <h2 className="font-display text-lg uppercase tracking-wide text-[#1B3A5C]">Update Stock</h2>
                <p className="text-sm text-gray-400 mt-0.5">{editing.inventory_items.name}</p>
              </div>
              <button onClick={() => setEditing(null)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">
                  Current Quantity ({editing.inventory_items.unit})
                </label>
                <input name="quantity" type="number" min="0" step="0.01" required
                  defaultValue={editing.quantity}
                  className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] focus:outline-none focus:ring-2 focus:ring-[#B83232]/40" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">
                  Reorder Threshold ({editing.inventory_items.unit})
                </label>
                <input name="reorder_threshold" type="number" min="0" step="0.01" required
                  defaultValue={editing.reorder_threshold}
                  className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] focus:outline-none focus:ring-2 focus:ring-[#B83232]/40" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditing(null)}
                  className="flex-1 border border-black/10 text-gray-400 rounded-lg py-2 text-sm font-display uppercase tracking-wide hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isPending}
                  className="flex-1 bg-[#B83232] hover:bg-[#9a2a2a] text-white rounded-lg py-2 text-sm font-display uppercase tracking-wide transition-colors disabled:opacity-50">
                  {isPending ? 'Saving…' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
