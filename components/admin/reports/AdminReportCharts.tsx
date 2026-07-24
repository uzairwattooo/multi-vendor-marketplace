"use client";

import {Bar,BarChart,CartesianGrid,Cell,Pie,PieChart,ResponsiveContainer,Tooltip,XAxis,YAxis,} from "recharts";

type Props = {
    salesTrend: Array<{ date: string; sales: number; orders: number }>;
    orderStatuses: Array<{ status: string; value: number }>;
};

const COLORS = ["#2563eb", "#f59e0b", "#8b5cf6", "#06b6d4", "#10b981", "#ef4444", "#64748b"];

function money(value: number) {
    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(value);
}

export default function AdminReportCharts({ salesTrend, orderStatuses }: Props) {
    return (
        <section className="grid gap-5 xl:grid-cols-[1.45fr_0.85fr]">
            <div className="rounded-2xl border bg-card p-5 shadow-sm">
                <h2 className="font-semibold">Sales trend</h2>
                <p className="mt-1 text-sm text-muted-foreground">Daily paid marketplace revenue</p>
                <div className="mt-6 h-80">
                    {salesTrend.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={salesTrend} margin={{ left: 5, right: 5 }}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                                <XAxis dataKey="date" tickFormatter={(value) => new Date(`${value}T00:00:00`).toLocaleDateString("en-PK", { day: "numeric", month: "short" })} tickLine={false} axisLine={false} fontSize={12} />
                                <YAxis tickFormatter={money} tickLine={false} axisLine={false} fontSize={12} width={70} />
                                <Tooltip formatter={(value) => money(Number(value))} labelFormatter={(value) => new Date(`${value}T00:00:00`).toLocaleDateString("en-PK", { dateStyle: "medium" })} />
                                <Bar dataKey="sales" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No paid sales in this period.</div>
                    )}
                </div>
            </div>

            <div className="rounded-2xl border bg-card p-5 shadow-sm">
                <h2 className="font-semibold">Order status</h2>
                <p className="mt-1 text-sm text-muted-foreground">Order distribution in this period</p>
                <div className="mt-3 h-60">
                    {orderStatuses.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={orderStatuses} dataKey="value" nameKey="status" innerRadius={55} outerRadius={88} paddingAngle={3}>
                                    {orderStatuses.map((item, index) => <Cell key={item.status} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No orders in this period.</div>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {orderStatuses.map((item, index) => (
                        <div key={item.status} className="flex items-center justify-between gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm">
                            <span className="flex min-w-0 items-center gap-2 capitalize">
                                <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                <span className="truncate">{item.status}</span>
                            </span>
                            <strong>{item.value}</strong>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}