"use client";

import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type RevenueChartProps = {
    data: Array<{
        month: string;
        revenue: number;
        platformFee: number;
    }>;
    currency: string;
};

function formatMoney(
    value: number,
    currency: string,
) {
    try {
        return new Intl.NumberFormat("en-PK", {
            style: "currency",
            currency: currency.toUpperCase(),
            maximumFractionDigits: 0,
        }).format(value);
    } catch {
        return `${currency.toUpperCase()} ${value.toLocaleString()}`;
    }
}

export default function RevenueChart({
    data,
    currency,
}: RevenueChartProps) {
    return (
        <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
            <div>
                <p className="text-sm font-semibold">
                    Revenue overview
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                    Paid marketplace volume and platform commission
                    during the last six months.
                </p>
            </div>

            <div className="mt-6 h-[320px]">
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >
                    <AreaChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 8,
                            left: -12,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient
                                id="adminRevenue"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="var(--chart-1)"
                                    stopOpacity={0.28}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--chart-1)"
                                    stopOpacity={0}
                                />
                            </linearGradient>

                            <linearGradient
                                id="adminCommission"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="var(--chart-2)"
                                    stopOpacity={0.24}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--chart-2)"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="var(--border)"
                        />

                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fontSize: 12,
                                fill: "var(--muted-foreground)",
                            }}
                        />

                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fontSize: 12,
                                fill: "var(--muted-foreground)",
                            }}
                            tickFormatter={(value) =>
                                Number(value).toLocaleString()
                            }
                        />

                        <Tooltip
                            formatter={(
                                value,
                                name,
                            ) => [
                                formatMoney(
                                    Number(value ?? 0),
                                    currency,
                                ),
                                name === "platformFee"
                                    ? "Platform fee"
                                    : "Gross revenue",
                            ]}
                            contentStyle={{
                                borderRadius: "14px",
                                border: "1px solid var(--border)",
                                background: "var(--card)",
                            }}
                        />

                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="var(--chart-1)"
                            strokeWidth={2.5}
                            fill="url(#adminRevenue)"
                        />

                        <Area
                            type="monotone"
                            dataKey="platformFee"
                            stroke="var(--chart-2)"
                            strokeWidth={2.5}
                            fill="url(#adminCommission)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}
