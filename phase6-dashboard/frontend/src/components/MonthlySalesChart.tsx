'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { apiClient } from '@/lib/api'
import { useChartTheme } from '@/lib/chartTheme'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

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

export function MonthlySalesChart() {
  const [mounted, setMounted] = useState(false)
  const theme = useChartTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const { data: monthlySales, isLoading, error } = useQuery({
    queryKey: ['monthlySales'],
    queryFn: () => apiClient.getMonthlySales(),
  })

  if (error) {
    return (
      <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Monthly Sales Trend
        </h3>
        <div className="text-sm text-red-600 dark:text-red-400">Error loading chart data</div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        Monthly Sales Trend
      </h3>
      {isLoading ? (
        <ChartSkeleton />
      ) : mounted ? (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={monthlySales || []}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
            <XAxis
              dataKey="period"
              stroke={theme.text}
              style={{ fontSize: '12px' }}
              tick={{ fill: theme.label }}
            />
            <YAxis
              stroke={theme.text}
              style={{ fontSize: '12px' }}
              tick={{ fill: theme.label }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
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
              fill="#6366f1"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : null}
    </Card>
  )
}
