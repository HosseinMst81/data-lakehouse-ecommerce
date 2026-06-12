'use client'

import { KpiCards } from './KpiCards'
import { DailySalesChart } from './DailySalesChart'
import { MonthlySalesChart } from './MonthlySalesChart'
import { TopProductsChart } from './TopProductsChart'
import { SalesByCountryChart } from './SalesByCountryChart'
import { TopCustomersTable } from './TopCustomersTable'
import { ThemeToggle } from './ThemeToggle'

export function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              E-Commerce Analytics
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Real-time insights into your business performance
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* KPI Section */}
        <section className="mb-8">
          <KpiCards />
        </section>

        {/* Charts Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <DailySalesChart />
          <MonthlySalesChart />
          <TopProductsChart />
          <SalesByCountryChart />
        </section>

        {/* Table Section */}
        <section className="mb-8">
          <TopCustomersTable />
        </section>
      </main>
    </div>
  )
}
