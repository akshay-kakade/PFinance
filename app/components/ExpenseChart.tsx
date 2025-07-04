'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, TooltipProps } from 'recharts'
import type { Transaction } from "../page"

interface Props {
  transactions: Transaction[]
}

interface ChartData {
  name: string
  value: number
  color: string
}

const COLORS = [
  '#ef4444', '#3b82f6', '#8b5cf6', '#10b981', 
  '#f59e0b', '#ec4899', '#6366f1', '#6b7280'
]

export default function ExpenseChart({ transactions }: Props) {
  const expenseTransactions = transactions.filter(t => t.type === 'expense')
  
  if (expenseTransactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No expenses to display</p>
      </div>
    )
  }

  // Group expenses by category
  const categoryTotals = expenseTransactions.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount
    return acc
  }, {} as Record<string, number>)

  // Convert to chart data format
  const chartData: ChartData[] = Object.entries(categoryTotals).map(([name, value], index) => ({
    name,
    value: Math.round(value * 100) / 100, // Round to 2 decimal places
    color: COLORS[index % COLORS.length]
  }))

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value)
  }

  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ChartData
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-blue-600">{formatCurrency(data.value)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
} 