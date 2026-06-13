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
        className="h-12 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 rounded animate-pulse"
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
      <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Top Customers
        </h3>
        <div className="text-sm text-red-600 dark:text-red-400">Error loading table data</div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Top Customers</h3>
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
        <TableSkeleton />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700">
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Customer ID
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900 dark:text-white">
                  Total Revenue
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900 dark:text-white">
                  Invoices
                </th>
              </tr>
            </thead>
            <tbody>
              {(customers || []).map((customer, index) => (
                <tr
                  key={customer.CustomerID}
                  className={`border-b border-slate-100 dark:border-slate-700 ${
                    index % 2 === 0
                      ? 'bg-white dark:bg-slate-800'
                      : 'bg-slate-50 dark:bg-slate-700/50'
                  } hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors`}
                >
                  <td className="px-4 py-3 text-sm text-slate-900 dark:text-white font-medium">
                    {customer.CustomerID}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-slate-900 dark:text-white">
                    {formatCurrency(customer.TotalRevenue)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-slate-600 dark:text-slate-400">
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
