'use client'

import React, { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Pencil, X, ChevronDown, ChevronRight } from 'lucide-react'
import { createOrder, updateOrderStatus, deleteOrder } from './actions'

type InventoryItem = { id: string; name: string; unit: string }

type OrderItem = {
  id: string
  inventory_item_id: string
  quantity: number
  unit_cost: number
  inventory_items: { name: string; unit: string }
}

export type PurchaseOrder = {
  id: string
  supplier: string
  status: string
  notes: string | null
  total: number
  created_at?: string
  purchase_order_items: OrderItem[]
}

type LineItem = { key: number; inventory_item_id: string; quantity: string; unit_cost: string }

const STATUSES = [
  { value: 'pending',   label: 'Pending' },
  { value: 'received',  label: 'Received' },
  { value: 'cancelled', label: 'Cancelled' },
]

function StatusBadge({ status }: { status: string }) {
  if (status === 'received')
    return (
      <span style={{ background: 'rgba(20,83,45,0.5)', color: '#86efac' }}
        className="text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap">
        Received
      </span>
    )
  if (status === 'cancelled')
    return (
      <span style={{ background: 'rgba(153,27,27,0.5)', color: '#fca5a5' }}
        className="text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap">
        Cancelled
      </span>
    )
  return (
    <span style={{ background: 'rgba(120,53,15,0.5)', color: '#fcd34d' }}
      className="text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap">
      Pending
    </span>
  )
}

function fmt(n: number) {
  return `$${n.toFixed(2)}`
}

let keyCounter = 1

export function PurchaseOrdersClient({
  inventoryItems,
  orders,
}: {
  inventoryItems: InventoryItem[]
  orders: PurchaseOrder[]
}) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { key: 0, inventory_item_id: '', quantity: '', unit_cost: '' },
  ])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null)
  const [isPending, startTransition] = useTransition()

  const orderTotal = lineItems.reduce((sum, item) => {
    return sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.unit_cost) || 0)
  }, 0)

  function addLineItem() {
    setLineItems((prev) => [
      ...prev,
      { key: keyCounter++, inventory_item_id: '', quantity: '', unit_cost: '' },
    ])
  }

  function removeLineItem(key: number) {
    setLineItems((prev) => prev.filter((i) => i.key !== key))
  }

  function updateLineItem(key: number, field: keyof Omit<LineItem, 'key'>, value: string) {
    setLineItems((prev) =>
      prev.map((i) => (i.key === key ? { ...i, [field]: value } : i))
    )
  }

  function handleSubmit(e: { currentTarget: HTMLFormElement; preventDefault(): void }) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const supplier = (fd.get('supplier') as string).trim()
    const status = fd.get('status') as string
    const notes = (fd.get('notes') as string).trim() || null

    const validItems = lineItems.filter(
      (i) => i.inventory_item_id && parseFloat(i.quantity) > 0
    )
    if (validItems.length === 0) return

    startTransition(async () => {
      await createOrder({
        supplier,
        status,
        notes,
        items: validItems.map((i) => ({
          inventory_item_id: i.inventory_item_id,
          quantity: parseFloat(i.quantity),
          unit_cost: parseFloat(i.unit_cost) || 0,
        })),
      })
      formRef.current?.reset()
      setLineItems([{ key: keyCounter++, inventory_item_id: '', quantity: '', unit_cost: '' }])
      router.refresh()
    })
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this purchase order? This cannot be undone.')) return
    startTransition(async () => {
      await deleteOrder(id)
      router.refresh()
    })
  }

  function handleStatusSubmit(e: { currentTarget: HTMLFormElement; preventDefault(): void }) {
    e.preventDefault()
    if (!editingOrder) return
    const fd = new FormData(e.currentTarget)
    const newStatus = fd.get('status') as string
    startTransition(async () => {
      await updateOrderStatus(editingOrder.id, newStatus)
      setEditingOrder(null)
      router.refresh()
    })
  }

  return (
    <div className="p-6 md:p-10 flex flex-col gap-8">
      <h1 className="font-display text-3xl uppercase tracking-wide text-[#1B3A5C]">
        Purchase Orders
      </h1>

      {/* ── Create order form ─────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-black/5 p-6 max-w-2xl mx-auto w-full">
        <p className="font-display text-xs uppercase tracking-widest text-[#1B3A5C]/50 mb-5">
          Create New Order
        </p>
        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">
                Supplier
              </label>
              <input
                name="supplier"
                type="text"
                required
                placeholder="e.g. Sam's Club, Restaurant Depot"
                className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] placeholder:text-black/20 focus:outline-none focus:ring-2 focus:ring-[#B83232]/40"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">
                Status
              </label>
              <select
                name="status"
                defaultValue="pending"
                className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] focus:outline-none focus:ring-2 focus:ring-[#B83232]/40 bg-white"
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
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

          {/* Line items */}
          <div className="flex flex-col gap-3">
            {/* Column headers — shown once */}
            <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr 1fr 32px' }}>
              <span className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">Item</span>
              <span className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">Qty</span>
              <span className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">Unit $</span>
              <span />
            </div>

            {lineItems.map((item) => {
              const unit = inventoryItems.find((i) => i.id === item.inventory_item_id)?.unit
              return (
                <div key={item.key} className="grid gap-4 items-center" style={{ gridTemplateColumns: '1fr 1fr 1fr 32px' }}>
                  <select
                    required
                    value={item.inventory_item_id}
                    onChange={(e) => updateLineItem(item.key, 'inventory_item_id', e.target.value)}
                    className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] focus:outline-none focus:ring-2 focus:ring-[#B83232]/40 bg-white"
                  >
                    <option value="" disabled>Select ingredient</option>
                    {inventoryItems.map((ing) => (
                      <option key={ing.id} value={ing.id}>{ing.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    placeholder={unit ?? '0'}
                    value={item.quantity}
                    onChange={(e) => updateLineItem(item.key, 'quantity', e.target.value)}
                    className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] placeholder:text-black/20 focus:outline-none focus:ring-2 focus:ring-[#B83232]/40"
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={item.unit_cost}
                    onChange={(e) => updateLineItem(item.key, 'unit_cost', e.target.value)}
                    className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] placeholder:text-black/20 focus:outline-none focus:ring-2 focus:ring-[#B83232]/40"
                  />
                  <button
                    type="button"
                    onClick={() => removeLineItem(item.key)}
                    disabled={lineItems.length === 1}
                    className="p-1.5 rounded text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    <X size={14} />
                  </button>
                </div>
              )
            })}

            <button
              type="button"
              onClick={addLineItem}
              className="flex items-center gap-1.5 text-xs font-display uppercase tracking-wide text-[#1B3A5C]/60 hover:text-[#1B3A5C] transition-colors mt-1 self-start"
            >
              <Plus size={14} />
              Add Item
            </button>
          </div>

          {/* Order total */}
          <div className="flex justify-end items-center gap-3 pt-1 border-t border-black/5">
            <span className="font-display text-xs uppercase tracking-widest text-[#1B3A5C]/50">
              Order Total
            </span>
            <span className="font-mono text-lg font-bold text-[#1B3A5C]">
              {fmt(orderTotal)}
            </span>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="bg-[#B83232] hover:bg-[#9a2a2a] text-white rounded-lg py-2.5 text-sm font-display uppercase tracking-wide transition-colors disabled:opacity-50"
          >
            {isPending ? 'Creating…' : 'Create Order'}
          </button>
        </form>
      </div>

      {/* ── Orders history table ──────────────────────────── */}
      <div>
        <p className="font-display text-xs uppercase tracking-widest text-[#1B3A5C]/50 mb-4">
          Orders
        </p>
        <div className="overflow-x-auto overflow-y-hidden rounded-xl shadow-lg border border-white/5">
          <table className="w-full text-sm" style={{ minWidth: '680px' }}>
            <thead>
              <tr style={{ background: '#12202E' }}>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/60">Date</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/60">Supplier</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/60">Items</th>
                <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/60">Total</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/60">Status</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center px-6 py-16 text-white/40"
                    style={{ background: '#1B3A5C' }}>
                    No purchase orders yet.
                  </td>
                </tr>
              ) : (
                orders.map((order, i) => {
                  const isExpanded = expandedId === order.id
                  const bg = i % 2 === 0 ? '#1B3A5C' : '#163554'
                  return (
                    <React.Fragment key={order.id}>
                      <tr
                        style={{ background: bg }}
                        className="border-t border-white/5 transition-all hover:brightness-125 cursor-pointer"
                        onClick={() => setExpandedId(isExpanded ? null : order.id)}
                      >
                        <td className="px-6 py-4 text-white/60 font-mono text-xs whitespace-nowrap">
                          {order.created_at
                            ? new Date(order.created_at).toLocaleDateString('en-US', {
                                month: 'short', day: 'numeric', year: 'numeric',
                              })
                            : '—'}
                        </td>
                        <td className="px-6 py-4 text-white font-medium">{order.supplier}</td>
                        <td className="px-6 py-4 text-white/60">{order.purchase_order_items.length}</td>
                        <td className="px-6 py-4 text-white font-mono text-right">{fmt(order.total)}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : order.id)}
                              className="p-2 rounded text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                              aria-label={isExpanded ? 'Collapse' : 'Expand'}
                            >
                              {isExpanded
                                ? <ChevronDown size={15} />
                                : <ChevronRight size={15} />}
                            </button>
                            <button
                              onClick={() => setEditingOrder(order)}
                              className="p-2 rounded text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                              aria-label="Edit status"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(order.id)}
                              disabled={isPending}
                              className="p-2 rounded text-white/40 hover:text-red-400 hover:bg-white/10 transition-colors disabled:opacity-30"
                              aria-label="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded line items */}
                      {isExpanded && (
                        <tr key={`${order.id}-items`} style={{ background: '#0F1A27' }}>
                          <td colSpan={6} className="px-8 py-4">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="border-b border-white/10">
                                  <th className="text-left pb-2 text-white/40 font-display uppercase tracking-widest">Item</th>
                                  <th className="text-left pb-2 text-white/40 font-display uppercase tracking-widest">Qty</th>
                                  <th className="text-left pb-2 text-white/40 font-display uppercase tracking-widest">Unit Cost</th>
                                  <th className="text-right pb-2 text-white/40 font-display uppercase tracking-widest">Subtotal</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.purchase_order_items.map((item) => (
                                  <tr key={item.id} className="border-b border-white/5 last:border-0">
                                    <td className="py-2 text-white/80">{item.inventory_items.name}</td>
                                    <td className="py-2 text-white/60 font-mono">
                                      {item.quantity} {item.inventory_items.unit}
                                    </td>
                                    <td className="py-2 text-white/60 font-mono">{fmt(item.unit_cost)}</td>
                                    <td className="py-2 text-white font-mono text-right">
                                      {fmt(item.quantity * item.unit_cost)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            {order.notes && (
                              <p className="mt-3 text-xs text-white/40 italic">
                                Note: {order.notes}
                              </p>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Edit status modal ─────────────────────────────── */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-black/5">
              <div>
                <h2 className="font-display text-lg uppercase tracking-wide text-[#1B3A5C]">
                  Update Status
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">{editingOrder.supplier}</p>
              </div>
              <button
                onClick={() => setEditingOrder(null)}
                className="p-1.5 rounded hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleStatusSubmit} className="px-6 py-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-display text-xs uppercase tracking-wide text-[#1B3A5C]">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue={editingOrder.status}
                  className="border border-black/10 rounded-lg px-3 py-2 text-sm text-[#1B3A5C] focus:outline-none focus:ring-2 focus:ring-[#B83232]/40 bg-white"
                >
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                {editingOrder.status !== 'received' && (
                  <p className="text-xs text-amber-600 mt-1">
                    Marking as Received will add all quantities to stock.
                  </p>
                )}
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
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
