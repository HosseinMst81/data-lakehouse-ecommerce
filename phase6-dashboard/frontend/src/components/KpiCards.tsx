'use client'

import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { apiClient } from '@/lib/api'
import { TrendingUp } from 'lucide-react'

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value)
}

const KpiSkeleton = () => (
  <div className="h-24 bg-gradient-to-r from-slate-200 to-slate-100 rounded-lg animate-pulse" />
)

interface KpiCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  isLoading?: boolean
}

const KpiCard = ({ title, value, icon, isLoading }: KpiCardProps) => (
  <Card className="p-6 bg-white border-slate-200">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-600 mb-2">{title}</p>
        {isLoading ? (
          <div className="h-8 bg-slate-100 rounded w-3/4 animate-pulse" />
        ) : (
          <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        )}
      </div>
      {icon && <div className="ml-4 text-indigo-600">{icon}</div>}
    </div>
  </Card>
)

export function KpiCards() {
  const { data: summary, isLoading, error } = useQuery({
    queryKey: ['summary'],
    queryFn: () => apiClient.getSummary(),
  })

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-red-50 border-red-200">
          <p className="text-sm text-red-600">Error loading KPI data</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {isLoading ? (
        <>
          <KpiSkeleton />
          <KpiSkeleton />
          <KpiSkeleton />
        </>
      ) : (
        <>
          <KpiCard
            title="Total Revenue"
            value={formatCurrency(summary?.total_revenue || 0)}
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <KpiCard
            title="Total Invoices"
            value={formatNumber(summary?.total_invoices || 0)}
          />
          <KpiCard
            title="Avg. Daily Revenue"
            value={formatCurrency(summary?.avg_daily_revenue || 0)}
          />
        </>
      )}
    </div>
  )
}
