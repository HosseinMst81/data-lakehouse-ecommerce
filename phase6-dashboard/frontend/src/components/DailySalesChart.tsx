'use client'

import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { apiClient } from '@/lib/api'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const ChartSkeleton = () => (
  <div className="h-80 bg-gradient-to-r from-slate-100 to-slate-50 rounded-lg animate-pulse" />
)

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function DailySalesChart() {
  const { data: dailySales, isLoading, error } = useQuery({
    queryKey: ['dailySales'],
    queryFn: () => apiClient.getDailySales(100),
  })

  if (error) {
    return (
      <Card className="p-6 bg-white border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Daily Sales Trend
        </h3>
        <div className="text-sm text-red-600">Error loading chart data</div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-white border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Daily Sales Trend
      </h3>
      {isLoading ? (
        <ChartSkeleton />
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={dailySales || []}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="SaleDate"
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
              tick={{ fill: '#64748b' }}
            />
            <YAxis
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
              tick={{ fill: '#64748b' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: 'none',
                borderRadius: '6px',
                color: '#f1f5f9',
              }}
              formatter={(value: number) => formatCurrency(value)}
              labelStyle={{ color: '#cbd5e1' }}
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
      )}
    </Card>
  )
}
