/**
 * CSS class name constants for the admin dark table pattern.
 * The styles live in globals.css (@layer components) so they're always bundled.
 * Used across Ingredients, Stock, Log Usage, Log Waste, Expenses, Purchase Orders.
 */
export const dt = {
  container: 'dt-container',
  head: 'dt-head',
  headCell: 'dt-head-cell font-display',
  row: (alt: boolean) => (alt ? 'dt-row dt-row-alt' : 'dt-row'),
  cell: {
    primary: 'dt-cell-primary font-sans',
    secondary: 'dt-cell-secondary font-sans capitalize',
    mono: 'dt-cell-mono',
    actions: 'dt-cell-actions',
  },
  emptyState: 'dt-empty font-sans',
  iconBtn: {
    edit: 'dt-icon-edit',
    delete: 'dt-icon-delete',
  },
}
