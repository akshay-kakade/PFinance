'use client'

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { DollarSign, PieChart, Calendar, Plus, Loader2 } from "lucide-react"
import TransactionForm from "./components/TransactionForm"
import TransactionList from "./components/TransactionList"
import FinancialSummary from "./components/FinancialSummary"
import ExpenseChart from "./components/ExpenseChart"
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker"

export interface Category {
  name: string
  color: string
  icon: string
}

const EXPENSE_CATEGORIES: Category[] = [
  { name: 'Food & Dining', color: 'bg-red-500', icon: '🍽️' },
  { name: 'Transportation', color: 'bg-blue-500', icon: '🚗' },
  { name: 'Shopping', color: 'bg-purple-500', icon: '🛍️' },
  { name: 'Entertainment', color: 'bg-green-500', icon: '🎬' },
  { name: 'Bills & Utilities', color: 'bg-yellow-500', icon: '💡' },
  { name: 'Healthcare', color: 'bg-pink-500', icon: '🏥' },
  { name: 'Education', color: 'bg-indigo-500', icon: '📚' },
  { name: 'Other', color: 'bg-gray-500', icon: '📦' }
]

const INCOME_CATEGORIES: Category[] = [
  { name: 'Salary', color: 'bg-green-600', icon: '💰' },
  { name: 'Freelance', color: 'bg-blue-600', icon: '💼' },
  { name: 'Investment', color: 'bg-purple-600', icon: '📈' },
  { name: 'Gift', color: 'bg-pink-600', icon: '🎁' },
  { name: 'Other', color: 'bg-gray-600', icon: '📦' }
]

export interface Transaction {
  _id?: string
  type: 'income' | 'expense'
  category: string
  amount: number
  description: string
  date: string
  createdAt?: string
  updatedAt?: string
}

export default function HomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/transactions')
        const data = await res.json()
        // Filter by selected month
        const filtered = data.filter((t: Transaction) => t.date.startsWith(selectedMonth))
        setTransactions(filtered)
      } catch (err) {
        console.error('Error loading transactions:', err)
        setError('Failed to load transactions. Please check your MongoDB configuration.')
      } finally {
        setLoading(false)
      }
    }
    loadTransactions()
  }, [selectedMonth])

  const addTransaction = async (transaction: Omit<Transaction, '_id'>) => {
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction)
      })
      const newTransaction = await res.json()
      setTransactions(prev => [newTransaction, ...prev])
      setShowForm(false)
    } catch (err) {
      console.error('Error adding transaction:', err)
      setError('Failed to add transaction. Please try again.')
    }
  }

  const deleteTransaction = async (id: string) => {
    try {
      await fetch(`/api/transactions?id=${id}`, { method: 'DELETE' })
      setTransactions(prev => prev.filter(t => t._id !== id))
    } catch (err) {
      console.error('Error deleting transaction:', err)
      setError('Failed to delete transaction. Please try again.')
    }
  }

  const getMonthlyStats = () => {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
    return { income, expenses, balance: income - expenses }
  }

  const stats = getMonthlyStats()

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-lg max-w-md mx-4">
          <h2 className="text-xl font-bold text-red-600 mb-4">Database Connection Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <DollarSign className="text-green-600" />
            Personal Finance Tracker
          </h1>
          <p className="text-gray-600">Take control of your financial future</p>
        </div>

        {/* Month Selector */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <Calendar className="text-gray-600" />
          <label htmlFor="month-selector" className="sr-only">Select Month</label>
          <DatePicker
            selected={new Date(selectedMonth + "-01")}
            onChange={date => setSelectedMonth(format(date as Date, "yyyy-MM"))}
            dateFormat="yyyy-MM"
            showMonthYearPicker
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select month to view transactions"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin text-blue-600 mr-2" />
            <span className="text-gray-600">Loading transactions...</span>
          </div>
        )}

        {/* Financial Summary Cards */}
        {!loading && <FinancialSummary stats={stats} />}

        {/* Add Transaction Button */}
        <div className="text-center mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 mx-auto"
          >
            <Plus size={20} />
            Add Transaction
          </button>
        </div>

        {/* Transaction Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <TransactionForm
                onAdd={addTransaction}
                onCancel={() => setShowForm(false)}
                expenseCategories={EXPENSE_CATEGORIES}
                incomeCategories={INCOME_CATEGORIES}
              />
            </div>
          </div>
        )}

        {/* Charts and Transactions */}
        {!loading && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Expense Chart */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <PieChart className="text-blue-600" />
                Expense Breakdown
              </h3>
              <ExpenseChart transactions={transactions} />
            </div>

            {/* Transaction List */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
              <TransactionList
                transactions={transactions.slice(0, 10)}
                onDelete={deleteTransaction}
                expenseCategories={EXPENSE_CATEGORIES}
                incomeCategories={INCOME_CATEGORIES}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
