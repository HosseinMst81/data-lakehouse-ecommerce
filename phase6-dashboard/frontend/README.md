# E-Commerce Analytics Dashboard

A production-ready React/TypeScript analytics dashboard built with modern web technologies.

## 🎯 Features

- **Real-time KPI Cards**: Total Revenue, Total Invoices, and Average Daily Revenue
- **Daily Sales Trend**: Area chart with smooth curve and gradient fill
- **Monthly Sales Trend**: Bar chart showing monthly revenue patterns
- **Top Products by Revenue**: Horizontal bar chart with configurable limit (Top 5, 10, or 20)
- **Sales by Country**: Bar chart displaying top 10 countries
- **Top Customers Table**: Interactive table with alternating rows and hover effects
- **Loading States**: Skeleton placeholders for all data-fetching components
- **Error Handling**: Graceful error displays across all components
- **Responsive Design**: Optimized for desktop and tablet screens
- **Professional Styling**: Clean light theme with Tailwind CSS and shadcn/ui

## 📦 Technology Stack

- **Framework**: React 19 + TypeScript
- **State Management**: TanStack React Query v5
- **Charts**: Recharts 3.8.1
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Build Tool**: Next.js 16
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:3000`.

## 📡 API Integration

The dashboard is configured to fetch data from a FastAPI backend via the `/api` endpoint. The frontend is designed to work with a proxy setup that forwards all `/api` requests to your backend service.

### Setting Up the Proxy

In your development environment, ensure your build tool is configured to proxy `/api` requests. For Next.js, this is typically handled through API routes or middleware.

### Required API Endpoints

The dashboard expects the following endpoints:

1. **GET `/api/summary`**
   - Returns: `{ total_revenue: number, total_invoices: number, avg_daily_revenue: number }`

2. **GET `/api/daily_sales?limit=100`**
   - Returns: `Array<{ SaleDate: string, TotalRevenue: number, NumberOfInvoices: number }>`

3. **GET `/api/monthly_sales`**
   - Returns: `Array<{ Year: number, Month: number, TotalRevenue: number, NumberOfInvoices: number, period: string }>`

4. **GET `/api/top_products?limit=10`**
   - Returns: `Array<{ StockCode: string, Description: string, TotalRevenue: number }>`

5. **GET `/api/sales_by_country`**
   - Returns: `Array<{ Country: string, TotalRevenue: number, NumberOfInvoices: number }>`

6. **GET `/api/top_customers?limit=10`**
   - Returns: `Array<{ CustomerID: number, TotalRevenue: number, NumberOfInvoices: number }>`

## 📂 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with QueryClientProvider
│   ├── page.tsx            # Main dashboard page
│   ├── app.tsx             # Query client setup
│   └── globals.css         # Global styles
├── components/
│   ├── Dashboard.tsx       # Main dashboard layout
│   ├── KpiCards.tsx        # KPI metrics cards
│   ├── DailySalesChart.tsx # Daily sales area chart
│   ├── MonthlySalesChart.tsx # Monthly sales bar chart
│   ├── TopProductsChart.tsx  # Top products horizontal bar chart
│   ├── SalesByCountryChart.tsx # Country sales bar chart
│   ├── TopCustomersTable.tsx   # Customers table
│   └── ui/
│       └── card.tsx        # shadcn Card component
├── lib/
│   ├── api.ts              # API client functions
│   ├── types.ts            # TypeScript interfaces
│   └── utils.ts            # Utility functions (cn)
└── package.json
```

## 🎨 Design System

### Color Palette

- **Primary**: Indigo (#6366f1)
- **Accent**: Amber (#f59e0b)
- **Success**: Emerald (#10b981)
- **Background**: Slate-50 (#f8fafc)
- **Borders**: Slate-200 (#e2e8f0)

### Typography

- **Heading Font**: Geist (sans-serif)
- **Body Font**: Geist (sans-serif)
- **Monospace Font**: Geist Mono

### Component Patterns

- **Cards**: White background with subtle borders and shadows
- **Charts**: Responsive containers with custom Recharts configuration
- **Tables**: Alternating row colors with hover effects
- **Selects**: Customized dropdowns for limit selection
- **Skeletons**: Gradient pulse animations for loading states

## 🔄 Data Fetching

The dashboard uses **TanStack React Query (v5)** with the following configuration:

- **Stale Time**: 5 minutes
- **Garbage Collection**: 10 minutes
- **Retry**: 1 attempt
- **Refetch on Window Focus**: Disabled

Each component manages its own queries with proper error and loading states.

## 🧹 Code Quality

- **TypeScript**: Full type coverage for all API responses and components
- **ESLint**: Configured for best practices
- **Component Structure**: Self-contained, reusable components
- **Error Handling**: Graceful error messages for all data-fetching scenarios

## 🚢 Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## 📝 Notes

- All currency values are formatted using `Intl.NumberFormat` with USD style
- The dashboard is optimized for screens 1024px and wider
- Skeleton placeholders provide visual feedback during data loading
- All charts are fully responsive using Recharts' `ResponsiveContainer`

## 🛠️ Customization

### Changing Colors

Edit the Tailwind classes in each component or modify `app/globals.css` to update the theme tokens.

### Adjusting Chart Heights

Modify the `height` prop in `ResponsiveContainer` components (currently 320px).

### Adding New KPIs

Create a new component following the `KpiCards.tsx` pattern and add it to the Dashboard layout.

## 📄 License

This dashboard is created with v0.
