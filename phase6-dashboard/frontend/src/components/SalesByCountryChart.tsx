'use client'

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

export function SalesByCountryChart() {
  const { data: countries, isLoading, error } = useQuery({
    queryKey: ['salesByCountry'],
    queryFn: async () => {
      const data = await apiClient.getSalesByCountry()
      // Return top 10 countries
      return data.slice(0, 10)
    },
  })

  if (error) {
    return (
      <Card className="p-6 bg-white border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Sales by Country
        </h3>
        <div className="text-sm text-red-600">Error loading chart data</div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-white border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Sales by Country (Top 10)
      </h3>
      {isLoading ? (
        <ChartSkeleton />
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={countries || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="Country"
              angle={-45}
              textAnchor="end"
              height={100}
              stroke="#94a3b8"
              tick={{ fill: '#64748b', fontSize: 12 }}
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
            <Bar
              dataKey="TotalRevenue"
              fill="#10b981"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
