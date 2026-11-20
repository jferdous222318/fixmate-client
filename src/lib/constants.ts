export const CATEGORIES = [
  "Smartphone", "Laptop & PC", "AC", "Refrigerator", "TV", "Washing Machine", "Electrical",
] as const;

export const SERVICE_MODES = ["Home Visit", "Shop Drop-off"] as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "How It Works" },
];

// one colour per status, reused in every dashboard
export const STATUS_STYLES: Record<string, string> = {
  requested: "bg-blue-100 text-blue-800 border-blue-300",
  accepted: "bg-indigo-100 text-indigo-800 border-indigo-300",
  "in-progress": "bg-amber-100 text-amber-800 border-amber-300",
  completed: "bg-green-100 text-green-800 border-green-300",
  rejected: "bg-red-100 text-red-800 border-red-300",
  cancelled: "bg-gray-200 text-gray-700 border-gray-300",
  unpaid: "bg-orange-100 text-orange-800 border-orange-300",
  paid: "bg-green-100 text-green-800 border-green-300",
};