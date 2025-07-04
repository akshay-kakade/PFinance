'use client'

import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"

interface Stats {
  income: number
  expenses: number
  balance: number
}

interface Props {
  stats: Stats
}

export default function FinancialSummary({ stats }: Props) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      {/* Income Card */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm font-medium">Total Income</p>
            <p className="text-3xl font-bold">{formatCurrency(stats.income)}</p>
          </div>
          <div className="bg-green-400 bg-opacity-30 p-3 rounded-full">
            <TrendingUp size={24} />
          </div>
        </div>
      </div>

      {/* Expenses Card */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-100 text-sm font-medium">Total Expenses</p>
            <p className="text-3xl font-bold">{formatCurrency(stats.expenses)}</p>
          </div>
          <div className="bg-red-400 bg-opacity-30 p-3 rounded-full">
            <TrendingDown size={24} />
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className={`rounded-lg p-6 shadow-lg ${
        stats.balance >= 0 
          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
          : 'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${
              stats.balance >= 0 ? 'text-blue-100' : 'text-orange-100'
            }`}>
              Net Balance
            </p>
            <p className="text-3xl font-bold">{formatCurrency(stats.balance)}</p>
          </div>
          <div className={`p-3 rounded-full ${
            stats.balance >= 0 
              ? 'bg-blue-400 bg-opacity-30' 
              : 'bg-orange-400 bg-opacity-30'
          }`}>
            <DollarSign size={24} />
          </div>
        </div>
      </div>
    </div>
  )
} 