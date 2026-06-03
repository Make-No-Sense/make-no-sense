import { Package, AlertTriangle, DollarSign } from "lucide-react";

const stats = [
  {
    label: "Total Ingredients",
    value: 0,
    icon: Package,
    description: "Items tracked in inventory",
  },
  {
    label: "Low Stock Items",
    value: 0,
    icon: AlertTriangle,
    description: "Below minimum threshold",
  },
  {
    label: "This Month Expenses",
    value: "$0",
    icon: DollarSign,
    description: "Total spend so far",
  },
  {
    label: "Total Waste This Month",
    value: 0,
    icon: AlertTriangle,
    description: "Units logged as waste",
  },
];

export default function DashboardPage() {
  return (
    <div className="p-6 md:p-10">
      <h1 className="font-display text-3xl uppercase tracking-wide text-admin-navy mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map(({ label, value, icon: Icon, description }) => (
          <div
            key={label}
            className="bg-white rounded-xl p-6 flex flex-col gap-4 shadow-sm border border-black/5"
          >
            <div className="flex items-center justify-between">
              <p className="text-admin-navy font-display uppercase tracking-wide text-sm">
                {label}
              </p>
              <div className="bg-off-white rounded-lg p-2">
                <Icon size={18} className="text-admin-navy/50" />
              </div>
            </div>
            <p className="font-mono text-4xl font-bold text-amber-gold">
              {value}
            </p>
            <p className="text-light-gray text-xs font-sans">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
