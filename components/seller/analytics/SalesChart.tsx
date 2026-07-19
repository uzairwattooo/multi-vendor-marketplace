import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { auth } from "@/lib/auth";
import { getSalesChart } from "@/lib/seller/get-sales-chart";

import SalesChartClient from "./SalesChartClient";

export default async function SalesChart() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        notFound();
    }

    const chartData = await getSalesChart(session.user.id);

    return <SalesChartClient chartData={chartData} />;
}
