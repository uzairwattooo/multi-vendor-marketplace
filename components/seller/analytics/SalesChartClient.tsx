"use client";

import { BarChart3 } from "lucide-react";
import {
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

type Props = {
    chartData: {
        month: string;
        revenue: number;
    }[];
};

export default function SalesChartClient({
    chartData,
}: Props) {
    if (chartData.length === 0) {
        return (
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <div className="flex h-96 items-center justify-center">
                    <div className="text-center">
                        <BarChart3 className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                        <h3 className="font-semibold">No Sales Data</h3>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#2563eb"
                            strokeWidth={3}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}