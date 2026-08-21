'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, Plus, X } from 'lucide-react'
import { addItem, updateItem, deleteItem } from './actions'

type InventoryItem = {
  id: string
  name: string
  item_type: string
  category: string
  unit: string
  cost_per_unit: number
}

const ITEM_TYPES = [
  { value: 'ingredient', label: 'Ingredient' },
  { value: 'packaging', label: 'Packaging' },
  { value: 'supplies',  label: 'Supplies' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'other',     label: 'Other' },
]

const CATEGORIES = [
  'protein', 'bread', 'produce', 'dairy',
  'condiment', 'drink', 'packaging', 'other',
]

type ModalState =
  | { mode: 'closed' }
  | { mode: 'add' }
  | { mode: 'edit'; item: InventoryItem }

export function InventoryTable({ items }: { items: InventoryItem[] }) {
  const router = useRouter()
  const [modal, setModal] = useState<ModalState>({ mode: 'closed' })
  const [isPending, startTransition] = useTransition()

  function closeModal() {
    setModal({ mode: 'closed' })
  }

  function handleSubmit(e: { currentTarget: HTMLFormElement; preventDefault(): void }) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      if (modal.mode === 'add') {
        await addItem(formData)
      } else if (modal.mode === 'edit') {
        await updateItem(modal.item.id, formData)
      }
      closeModal()
      router.refresh()
    })
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this item? This cannot be undone.')) return
    startTransition(async () => {
      await deleteItem(id)
      router.refresh()
    })
  }

  const editingItem = modal.mode === 'edit' ? modal.item : null

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl uppercase tracking-wide text-[#1B3A5C]">
          Inventory
        </h1>
        <button
          onClick={() => setModal({ mode: 'add' })}
          className="flex items-center gap-2 bg-[#B83232] hover:bg-[#9a2a2a] transition-colors text-white font-display uppercase tracking-wide text-sm px-4 py-2 rounded-lg"
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>

      <div className="overflow-x-auto overflow-y-hidden rounded-xl shadow-lg border border-white/5">
        <table className="w-full text-sm" style={{ minWidth: '640px' }}>
          <thead>
            <tr style={{ background: '#12202E' }}>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/60">Name</th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/60">Type</th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/60">Category</th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/60">Unit</th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/60">Cost / Unit</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center px-6 py-16 text-white/40" style={{ background: '#1B3A5C' }}>
                  No inventory items yet — add your first one.
                </td>
              </tr>
            ) : (
              items.map((item, i) => (
                <tr
                  key={item.id}
                  style={{ background: i % 2 === 0 ? '#1B3A5C' : '#163554' }}
                  className="border-t border-white/5 transition-all hover:brightness-125"
                >
                  <td className="px-6 py-4 text-white font-medium">{item.name}</td>
                  <td className="px-6 py-4 text-white/60 capitalize">
                    {ITEM_TYPES.find(t => t.value === item.item_type)?.label ?? item.item_type}
                  </td>
                  <td className="px-6 py-4 text-white/60 capitalize">{item.category}</td>
                  <td className="px-6 py-4 text-white/60">{item.unit}</td>
                  <td className="px-6 py-4 text-white font-mono">${item.cost_per_unit.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setModal({ mode: 'edit', item })}
                        className="p-2 rounded text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                        aria-label="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
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

      {modal.mode !== 'closed' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-black/5">
              <h2 className="font-display text-lg uppercase tracking-wide text-[#1B3A5C]">
                {modal.mode === 'add' ? 'Add Item' : 'Edit Item'}
              </h2>
              <button onClick={closeModal} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">Name</label>
                <input
                  name="name"
                  required
                  defaultValue={editingItem?.name ?? ''}
                  className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] focus:outline-none focus:ring-2 focus:ring-[#B83232]/40"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">Item Type</label>
                <select
                  name="item_type"
                  required
                  defaultValue={editingItem?.item_type ?? 'ingredient'}
                  className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] focus:outline-none focus:ring-2 focus:ring-[#B83232]/40 bg-white"
                >
                  {ITEM_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">Category</label>
                <select
                  name="category"
                  required
                  defaultValue={editingItem?.category ?? ''}
                  className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] focus:outline-none focus:ring-2 focus:ring-[#B83232]/40 bg-white"
                >
                  <option value="" disabled>Select a category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">Unit</label>
                <input
                  name="unit"
                  required
                  placeholder="e.g. lbs, oz, each"
                  defaultValue={editingItem?.unit ?? ''}
                  className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B83232]/40"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">Cost Per Unit ($)</label>
                <input
                  name="cost_per_unit"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  defaultValue={editingItem?.cost_per_unit ?? ''}
                  className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] focus:outline-none focus:ring-2 focus:ring-[#B83232]/40"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal}
                  className="flex-1 border border-black/10 text-gray-400 rounded-lg py-2 text-sm font-display uppercase tracking-wide hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isPending}
                  className="flex-1 bg-[#B83232] hover:bg-[#9a2a2a] text-white rounded-lg py-2 text-sm font-display uppercase tracking-wide transition-colors disabled:opacity-50">
                  {isPending ? 'Saving…' : modal.mode === 'add' ? 'Add' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
