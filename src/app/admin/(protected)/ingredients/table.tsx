'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, Plus, X } from 'lucide-react'
import { addIngredient, updateIngredient, deleteIngredient } from './actions'

type Ingredient = {
  id: number
  name: string
  category: string
  unit: string
  cost_per_unit: number
}

const CATEGORIES = [
  'protein',
  'bread',
  'produce',
  'dairy',
  'condiment',
  'drink',
  'packaging',
  'other',
]

type ModalState =
  | { mode: 'closed' }
  | { mode: 'add' }
  | { mode: 'edit'; ingredient: Ingredient }

export function IngredientTable({ ingredients }: { ingredients: Ingredient[] }) {
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
        await addIngredient(formData)
      } else if (modal.mode === 'edit') {
        await updateIngredient(modal.ingredient.id, formData)
      }
      closeModal()
      router.refresh()
    })
  }

  function handleDelete(id: number) {
    if (!confirm('Delete this ingredient? This cannot be undone.')) return
    startTransition(async () => {
      await deleteIngredient(id)
      router.refresh()
    })
  }

  const editingIngredient = modal.mode === 'edit' ? modal.ingredient : null

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl uppercase tracking-wide text-admin-navy">
          Ingredients
        </h1>
        <button
          onClick={() => setModal({ mode: 'add' })}
          className="flex items-center gap-2 bg-truck-red hover:bg-flame-orange transition-colors text-white font-display uppercase tracking-wide text-sm px-4 py-2 rounded-lg"
        >
          <Plus size={16} />
          Add Ingredient
        </button>
      </div>

      {ingredients.length === 0 ? (
        <div className="bg-white rounded-xl border border-black/5 shadow-sm p-12 text-center">
          <p className="text-light-gray font-sans">
            No ingredients yet — add your first one.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-black/5 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 bg-off-white">
                <th className="text-left px-5 py-3 font-display text-xs uppercase tracking-wide text-admin-navy">
                  Name
                </th>
                <th className="text-left px-5 py-3 font-display text-xs uppercase tracking-wide text-admin-navy">
                  Category
                </th>
                <th className="text-left px-5 py-3 font-display text-xs uppercase tracking-wide text-admin-navy">
                  Unit
                </th>
                <th className="text-left px-5 py-3 font-display text-xs uppercase tracking-wide text-admin-navy">
                  Cost / Unit
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ing, i) => (
                <tr
                  key={ing.id}
                  className={`border-b border-black/5 last:border-0 ${i % 2 === 1 ? 'bg-off-white/40' : ''}`}
                >
                  <td className="px-5 py-3 text-admin-navy font-sans">{ing.name}</td>
                  <td className="px-5 py-3 text-light-gray capitalize font-sans">
                    {ing.category}
                  </td>
                  <td className="px-5 py-3 text-light-gray font-sans">{ing.unit}</td>
                  <td className="px-5 py-3 font-mono text-amber-gold">
                    ${ing.cost_per_unit.toFixed(2)}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setModal({ mode: 'edit', ingredient: ing })}
                        className="p-1.5 rounded hover:bg-off-white text-light-gray hover:text-admin-navy transition-colors"
                        aria-label="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(ing.id)}
                        disabled={isPending}
                        className="p-1.5 rounded hover:bg-red-50 text-light-gray hover:text-truck-red transition-colors disabled:opacity-40"
                        aria-label="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal.mode !== 'closed' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-black/5">
              <h2 className="font-display text-lg uppercase tracking-wide text-admin-navy">
                {modal.mode === 'add' ? 'Add Ingredient' : 'Edit Ingredient'}
              </h2>
              <button
                onClick={closeModal}
                className="p-1.5 rounded hover:bg-off-white text-light-gray transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-display text-xs uppercase tracking-wide text-admin-navy">
                  Name
                </label>
                <input
                  name="name"
                  required
                  defaultValue={editingIngredient?.name ?? ''}
                  className="border border-black/10 rounded-lg px-3 py-2 text-sm font-sans text-admin-navy focus:outline-none focus:ring-2 focus:ring-truck-red/40"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-display text-xs uppercase tracking-wide text-admin-navy">
                  Category
                </label>
                <select
                  name="category"
                  required
                  defaultValue={editingIngredient?.category ?? ''}
                  className="border border-black/10 rounded-lg px-3 py-2 text-sm font-sans text-admin-navy focus:outline-none focus:ring-2 focus:ring-truck-red/40 bg-white"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="capitalize">
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-display text-xs uppercase tracking-wide text-admin-navy">
                  Unit
                </label>
                <input
                  name="unit"
                  required
                  placeholder="e.g. lbs, oz, each"
                  defaultValue={editingIngredient?.unit ?? ''}
                  className="border border-black/10 rounded-lg px-3 py-2 text-sm font-sans text-admin-navy placeholder:text-light-gray/60 focus:outline-none focus:ring-2 focus:ring-truck-red/40"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-display text-xs uppercase tracking-wide text-admin-navy">
                  Cost Per Unit ($)
                </label>
                <input
                  name="cost_per_unit"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  defaultValue={editingIngredient?.cost_per_unit ?? ''}
                  className="border border-black/10 rounded-lg px-3 py-2 text-sm font-sans text-admin-navy focus:outline-none focus:ring-2 focus:ring-truck-red/40"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 border border-black/10 text-light-gray rounded-lg py-2 text-sm font-display uppercase tracking-wide hover:bg-off-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-truck-red hover:bg-flame-orange text-white rounded-lg py-2 text-sm font-display uppercase tracking-wide transition-colors disabled:opacity-50"
                >
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
