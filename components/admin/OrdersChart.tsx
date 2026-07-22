"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type OrdersChartProps = {
    data: Array<{
        status: string;
        label: string;
        total: number;
    }>;
};

export default function OrdersChart({
    data,
}: OrdersChartProps) {
    return (
        <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
            <div>
                <p className="text-sm font-semibold">
                    Orders by status
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                    Current order distribution across the marketplace.
                </p>
            </div>

            <div className="mt-6 h-[320px]">
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >
                    <BarChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 8,
                            left: -18,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="var(--border)"
                        />

                        <XAxis
                            dataKey="label"
                            axisLine={false}
                            tickLine={false}
                            interval={0}
                            angle={-22}
                            textAnchor="end"
                            height={62}
                            tick={{
                                fontSize: 11,
                                fill: "var(--muted-foreground)",
                            }}
                        />

                        <YAxis
                            allowDecimals={false}
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fontSize: 12,
                                fill: "var(--muted-foreground)",
                            }}
                        />

                        <Tooltip
                            cursor={{
                                fill: "var(--muted)",
                                opacity: 0.45,
                            }}
                            contentStyle={{
                                borderRadius: "14px",
                                border: "1px solid var(--border)",
                                background: "var(--card)",
                            }}
                        />

                        <Bar
                            dataKey="total"
                            name="Orders"
                            fill="var(--chart-1)"
                            radius={[8, 8, 0, 0]}
                            maxBarSize={44}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}
