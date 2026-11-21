"use client";

import { useState } from "react";
import { BarChart3 } from "lucide-react";
import { STATUS_HEX } from "@/lib/constants";
import { monthLabel, statusLabel } from "@/lib/format";
import type { MonthlyPoint } from "@/lib/types";

// Hand-built SVG/HTML charts, so the dashboard needs no chart package.
// Single series = one hue, recessive grid, thin bars with rounded tops, hover tooltip.

function NoData({ text = "No data yet" }: { text?: string }) {
    return (
        <div className="flex h-56 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-ink/15 text-sm text-ink-soft">
            <BarChart3 size={26} className="text-ink/30" /> {text}
        </div>
    );
}

const niceMax = (v: number) => {
    if (v <= 0) return 10;
    const p = Math.pow(10, Math.floor(Math.log10(v)));
    return Math.ceil(v / p) * p;
};

// Monthly money chart (spending / earnings / revenue). Shows the last 6 months.
export function MonthlyBarChart({ data, label = "Amount" }: { data: MonthlyPoint[] | undefined; label?: string }) {
    const [hover, setHover] = useState<number | null>(null);

    // fill the last 6 months so empty months still appear as a zero
    const months: MonthlyPoint[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        months.push({ month: key, total: data?.find((p) => p.month === key)?.total ?? 0 });
    }
    if (!data || months.every((m) => m.total === 0)) return <NoData text="No payments in the last 6 months" />;

    const W = 560, H = 240, padL = 44, padB = 28, padT = 16;
    const max = niceMax(Math.max(...months.map((m) => m.total)));
    const innerW = W - padL - 8;
    const innerH = H - padB - padT;
    const slot = innerW / months.length;
    const barW = Math.min(36, slot * 0.5);
    const y = (v: number) => padT + innerH - (v / max) * innerH;

    return (
        <div className="relative">
            <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${label} per month`}>
                {[0, 0.5, 1].map((t) => (
                    <g key={t}>
                        <line x1={padL} x2={W - 8} y1={y(max * t)} y2={y(max * t)} stroke="#14211f" strokeOpacity={t === 0 ? 0.35 : 0.08} />
                        <text x={padL - 8} y={y(max * t) + 4} textAnchor="end" className="fill-ink-soft font-mono text-[11px]">${Math.round(max * t)}</text>
                    </g>
                ))}
                {months.map((m, i) => {
                    const cx = padL + slot * i + slot / 2;
                    const h = Math.max(0, y(0) - y(m.total));
                    const r = Math.min(4, h);
                    const x = cx - barW / 2, top = y(m.total);
                    return (
                        <g key={m.month} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
                            {/* large invisible hit area */}
                            <rect x={padL + slot * i} y={padT} width={slot} height={innerH} fill="transparent" />
                            {h > 0 && (
                                <path
                                    d={`M${x},${y(0)} V${top + r} Q${x},${top} ${x + r},${top} H${x + barW - r} Q${x + barW},${top} ${x + barW},${top + r} V${y(0)} Z`}
                                    fill="#0f5c55"
                                    opacity={hover === null || hover === i ? 1 : 0.45}
                                />
                            )}
                            <text x={cx} y={H - 8} textAnchor="middle" className="fill-ink-soft text-[11px] font-semibold">{monthLabel(m.month)}</text>
                        </g>
                    );
                })}
            </svg>
            {hover !== null && (
                <div
                    className="pointer-events-none absolute -translate-x-1/2 rounded-md border-2 border-ink bg-white px-2.5 py-1.5 text-xs shadow-hard-sm"
                    style={{ left: `${((padL + slot * hover + slot / 2) / W) * 100}%`, top: 0 }}
                >
                    <p className="font-semibold text-ink-soft">{monthLabel(months[hover].month)}</p>
                    <p className="font-mono font-bold">${months[hover].total.toLocaleString()}</p>
                </div>
            )}
        </div>
    );
}

// Horizontal bars with a direct label + count on every row (identity is never colour alone)
export function HBarList({
    rows, colorFor,
}: { rows: { label: string; value: number; key?: string }[]; colorFor?: (key: string) => string }) {
    const [hover, setHover] = useState<string | null>(null);
    const max = Math.max(1, ...rows.map((r) => r.value));
    if (!rows.length || rows.every((r) => r.value === 0)) return <NoData />;

    return (
        <ul className="space-y-3">
            {rows.map((r) => {
                const key = r.key ?? r.label;
                return (
                    <li key={key} onMouseEnter={() => setHover(key)} onMouseLeave={() => setHover(null)} className="group">
                        <div className="mb-1 flex items-center justify-between text-sm">
                            <span className="font-semibold">{r.label}</span>
                            <span className="font-mono font-bold text-ink-soft">{r.value}</span>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-paper-dark">
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                    width: `${(r.value / max) * 100}%`,
                                    background: colorFor ? colorFor(key) : "#0f5c55",
                                    opacity: hover === null || hover === key ? 1 : 0.45,
                                }}
                            />
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}

// Job status breakdown, coloured with the same status colours as the badges
export function StatusBreakdown({ counts }: { counts: Record<string, number> | undefined }) {
    const order = ["requested", "accepted", "in-progress", "completed", "rejected", "cancelled"];
    const rows = order.map((s) => ({ key: s, label: statusLabel(s), value: counts?.[s] ?? 0 }));
    return <HBarList rows={rows} colorFor={(k) => STATUS_HEX[k]} />;
}