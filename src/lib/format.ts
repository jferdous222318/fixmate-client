export const money = (n: number | undefined) =>
    `$${(n ?? 0).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

export const date = (d?: string | Date) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

export const statusLabel = (s: string) =>
    s === "in-progress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1);

// "2026-03" -> "Mar"
export const monthLabel = (m: string) =>
    new Date(`${m}-01T00:00:00`).toLocaleDateString("en-US", { month: "short" });

// local "YYYY-MM-DD" for the date input min attribute
export const todayInput = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
};