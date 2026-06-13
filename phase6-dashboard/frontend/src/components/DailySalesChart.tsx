"use client";

import { Card } from "@/components/ui/card";
import { apiClient } from "@/lib/api";
import { useChartTheme } from "@/lib/chartTheme";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const ChartSkeleton = () => (
  <div className="h-80 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 rounded-lg animate-pulse" />
);

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export function DailySalesChart() {
  const {
    data: dailySales,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dailySales"],
    queryFn: () => apiClient.getDailySales(100),
  });

  const mounted = useState(()=>{
    return true;
  });
  const theme = useChartTheme(); 

  if (error) {
    return (
      <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Daily Sales Trend
        </h3>
        <div className="text-sm text-red-600 dark:text-red-400">
          Error loading chart data
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        Daily Sales Trend
      </h3>
      {isLoading ? (
        <ChartSkeleton />
      ) : mounted ? (
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={dailySales || []}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
            <XAxis
              dataKey="SaleDate"
              stroke={theme.text}
              style={{ fontSize: "12px" }}
              tick={{ fill: theme.label }}
            />
            <YAxis
              stroke={theme.text}
              style={{ fontSize: "12px" }}
              tick={{ fill: theme.label }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.tooltip.bg,
                border: "none",
                borderRadius: "6px",
                color: theme.tooltip.text,
              }}
              labelStyle={{ color: theme.tooltip.label }}
              content={({ active, payload, label }) => (
                <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-slate-900 dark:text-white mb-1">{label}</p>
                  {active && payload && payload.length > 0 && (
                    <div className="space-y-1">
                      {payload.map((entry, index) => (
                        <div key={`item-${index}`} className="flex items-center">
                          <span className={`w-2 h-2 rounded-full mr-2 ${entry.color}`}></span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">{entry.name}: {formatCurrency(entry.value as number)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            />
            <Area
              type="monotone"
              dataKey="TotalRevenue"
              stroke="#6366f1"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : null}
    </Card>
  );
}
