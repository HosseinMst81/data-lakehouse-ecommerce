import {
  SummaryKPI,
  DailySales,
  MonthlySales,
  TopProduct,
  SalesByCountry,
  TopCustomer,
} from './types'

const API_BASE = '/api'

export const apiClient = {
  async getSummary(): Promise<SummaryKPI> {
    const response = await fetch(`${API_BASE}/summary`)
    if (!response.ok) throw new Error('Failed to fetch summary')
    return response.json()
  },

  async getDailySales(limit: number = 100): Promise<DailySales[]> {
    const response = await fetch(`${API_BASE}/daily_sales?limit=${limit}`)
    if (!response.ok) throw new Error('Failed to fetch daily sales')
    return response.json()
  },

  async getMonthlySales(): Promise<MonthlySales[]> {
    const response = await fetch(`${API_BASE}/monthly_sales`)
    if (!response.ok) throw new Error('Failed to fetch monthly sales')
    return response.json()
  },

  async getTopProducts(limit: number = 10): Promise<TopProduct[]> {
    const response = await fetch(`${API_BASE}/top_products?limit=${limit}`)
    if (!response.ok) throw new Error('Failed to fetch top products')
    return response.json()
  },

  async getSalesByCountry(): Promise<SalesByCountry[]> {
    const response = await fetch(`${API_BASE}/sales_by_country`)
    if (!response.ok) throw new Error('Failed to fetch sales by country')
    return response.json()
  },

  async getTopCustomers(limit: number = 10): Promise<TopCustomer[]> {
    const response = await fetch(`${API_BASE}/top_customers?limit=${limit}`)
    if (!response.ok) throw new Error('Failed to fetch top customers')
    return response.json()
  },
}
