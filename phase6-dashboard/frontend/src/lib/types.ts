// API Response Types
export interface SummaryKPI {
  total_revenue: number
  total_invoices: number
  avg_daily_revenue: number
}

export interface DailySales {
  SaleDate: string
  TotalRevenue: number
  NumberOfInvoices: number
}

export interface MonthlySales {
  Year: number
  Month: number
  TotalRevenue: number
  NumberOfInvoices: number
  period: string
}

export interface TopProduct {
  StockCode: string
  Description: string
  TotalRevenue: number
}

export interface SalesByCountry {
  Country: string
  TotalRevenue: number
  NumberOfInvoices: number
}

export interface TopCustomer {
  CustomerID: number
  TotalRevenue: number
  NumberOfInvoices: number
}
