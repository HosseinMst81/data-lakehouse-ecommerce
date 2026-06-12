import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { apiClient } from '@/lib/api'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useChartTheme } from '@/lib/chartTheme';

const ChartSkeleton = () => (
  <div className="h-80 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 rounded-lg animate-pulse" />
)

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
}

export function TopProductsChart() {
  const [limit, setLimit] = useState(10)
  const theme = useChartTheme()

  const mounted = useState(()=>{
    return true;
  });

  const { data: topProducts, isLoading, error } = useQuery({
    queryKey: ['topProducts', limit],
    queryFn: () => apiClient.getTopProducts(limit),
  })

  const chartData = (topProducts || []).map((product) => ({
    ...product,
    displayName: truncateText(product.Description, 20),
  }))

  if (error) {
    return (
      <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Top Products by Revenue
        </h3>
        <div className="text-sm text-red-600 dark:text-red-400">Error loading chart data</div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Top Products by Revenue
        </h3>
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="px-3 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value={5}>Top 5</option>
          <option value={10}>Top 10</option>
          <option value={20}>Top 20</option>
        </select>
      </div>
      {isLoading ? (
        <ChartSkeleton />
      ) : mounted ? (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
            <XAxis type="number" stroke={theme.text} tick={{ fill: theme.label }} />
            <YAxis
              dataKey="displayName"
              type="category"
              width={195}
              stroke={theme.text}
              tick={{ fill: theme.label, fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.tooltip.bg,
                border: 'none',
                borderRadius: '6px',
                color: theme.tooltip.text,
              }}
              formatter={(value: number) => formatCurrency(value)}
              labelStyle={{ color: theme.tooltip.label }}
            />
            <Bar
              dataKey="TotalRevenue"
              fill="#f59e0b"
              radius={[0, 8, 8, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : null}
    </Card>
  )
}
