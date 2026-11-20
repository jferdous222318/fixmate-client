import {
  AirVent, ClipboardList, CirclePlus, CreditCard, Inbox, Laptop, Layers, LayoutDashboard,
  Package, Receipt, Refrigerator, Smartphone, Tv, UserCog, Users, WashingMachine, Zap,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "./types";

export const CATEGORIES = [
  "Smartphone", "Laptop & PC", "AC", "Refrigerator", "TV", "Washing Machine", "Electrical",
] as const;

export const SERVICE_MODES = ["Home Visit", "Shop Drop-off"] as const;

export const CATEGORY_META: Record<string, { icon: LucideIcon; blurb: string }> = {
  Smartphone: { icon: Smartphone, blurb: "Screens, batteries, charging ports" },
  "Laptop & PC": { icon: Laptop, blurb: "Servicing, upgrades, OS repair" },
  AC: { icon: AirVent, blurb: "Gas refill, cleaning, installation" },
  Refrigerator: { icon: Refrigerator, blurb: "Cooling, compressor, thermostat" },
  TV: { icon: Tv, blurb: "Panels, backlight, board repair" },
  "Washing Machine": { icon: WashingMachine, blurb: "Drum, motor, drainage issues" },
  Electrical: { icon: Zap, blurb: "Wiring, sockets, breakers" },
};

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "How It Works" },
];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
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
  pending: "bg-amber-100 text-amber-800 border-amber-300",
  approved: "bg-green-100 text-green-800 border-green-300",
};

// same colours as hex, for the SVG charts
export const STATUS_HEX: Record<string, string> = {
  requested: "#3b82f6",
  accepted: "#6366f1",
  "in-progress": "#f59e0b",
  completed: "#16a34a",
  rejected: "#dc2626",
  cancelled: "#9ca3af",
};

export const ROLE_BADGE: Record<string, string> = {
  customer: "bg-mustard text-ink",
  technician: "bg-workshop text-white",
  admin: "bg-signal text-white",
};

export type MenuItem = { href: string; label: string; icon: LucideIcon };

// sidebar menu changes with the logged-in role
export const DASHBOARD_MENU: Record<Role, MenuItem[]> = {
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/customer/bookings", label: "My Bookings", icon: ClipboardList },
    { href: "/dashboard/customer/payments", label: "Payment History", icon: Receipt },
  ],
  technician: [
    { href: "/dashboard/technician", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/technician/add-service", label: "Add Service", icon: CirclePlus },
    { href: "/dashboard/technician/my-services", label: "My Services", icon: Package },
    { href: "/dashboard/technician/requests", label: "Manage Requests", icon: Inbox },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    { href: "/dashboard/admin/services", label: "Service Approval", icon: Layers },
    { href: "/dashboard/admin/bookings", label: "All Bookings", icon: ClipboardList },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: CreditCard },
  ],
};

export const PROFILE_LINK: MenuItem = { href: "/dashboard/profile", label: "Update Profile", icon: UserCog };