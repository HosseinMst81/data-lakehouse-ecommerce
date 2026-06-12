'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { apiClient } from '@/lib/api'

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

const TableSkeleton = () => (
  <div className="space-y-3">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="h-12 bg-gradient-to-r from-slate-100 to-slate-50 rounded animate-pulse"
      />
    ))}
  </div>
)

export function TopCustomersTable() {
  const [limit, setLimit] = useState(10)

  const { data: customers, isLoading, error } = useQuery({
    queryKey: ['topCustomers', limit],
    queryFn: () => apiClient.getTopCustomers(limit),
  })

  if (error) {
    return (
      <Card className="p-6 bg-white border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Top Customers
        </h3>
        <div className="text-sm text-red-600">Error loading table data</div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-white border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Top Customers</h3>
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="px-3 py-1 text-sm border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value={5}>Top 5</option>
          <option value={10}>Top 10</option>
          <option value={20}>Top 20</option>
        </select>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                  Customer ID
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                  Total Revenue
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                  Invoices
                </th>
              </tr>
            </thead>
            <tbody>
              {(customers || []).map((customer, index) => (
                <tr
                  key={customer.CustomerID}
                  className={`border-b border-slate-100 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                  } hover:bg-indigo-50 transition-colors`}
                >
                  <td className="px-4 py-3 text-sm text-slate-900 font-medium">
                    {customer.CustomerID}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-slate-900">
                    {formatCurrency(customer.TotalRevenue)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-slate-600">
                    {formatNumber(customer.NumberOfInvoices)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
