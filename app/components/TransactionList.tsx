'use client'

import { format } from "date-fns"
import { Trash2 } from "lucide-react"
import type { Transaction, Category } from "../page"
import toast from 'react-hot-toast';

interface Props {
  transactions: Transaction[]
  onDelete: (id: string) => void
  expenseCategories: Category[]
  incomeCategories: Category[]
}

export default function TransactionList({ transactions, onDelete, expenseCategories, incomeCategories }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-sm">No transactions yet</p>
        <p className="text-gray-400 text-xs mt-1">Add your first transaction to get started</p>
      </div>
    )
  }

  const getCategoryIcon = (categoryName: string, type: 'income' | 'expense') => {
    const categories = type === 'expense' ? expenseCategories : incomeCategories
    const category = categories.find(cat => cat.name === categoryName)
    return category?.icon || '📦'
  }

  const getCategoryColor = (categoryName: string, type: 'income' | 'expense') => {
    const categories = type === 'expense' ? expenseCategories : incomeCategories
    const category = categories.find(cat => cat.name === categoryName)
    return category?.color || 'bg-gray-500'
  }

  const handleDelete = (id: string) => {
    toast(
      (t) => (
        <div className="flex flex-col items-center">
          <span className="mb-3 text-base">Are you sure you want to delete?</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                onDelete(id);
                toast.dismiss(t.id);
              }}
              className="px-4 py-1 mr-10 bg-red-500 text-white rounded hover:bg-red-400 transition"
            >
              Yes
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-1 ml-10 bg-green-600 text-white rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {transactions.map((transaction) => (
        <div
          key={transaction._id}
          className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition"
        >
          <div className="flex items-center gap-3 flex-1">
            {/* Category Icon */}
            <div className={`w-10 h-10 rounded-full ${getCategoryColor(transaction.category, transaction.type)} flex items-center justify-center text-white text-lg`}>
              {getCategoryIcon(transaction.category, transaction.type)}
            </div>
            
            {/* Transaction Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 truncate">
                  {transaction.description}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  transaction.type === 'income' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {transaction.type}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{transaction.category}</span>
                <span>•</span>
                <span>{format(new Date(transaction.date), 'MMM dd, yyyy')}</span>
              </div>
            </div>
          </div>

          {/* Amount and Delete */}
          <div className="flex items-center gap-3">
            <span className={`font-semibold text-lg ${
              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
            }`}>
              {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
            </span>
            <button
              onClick={() => handleDelete(transaction._id!)}
              className="text-gray-400 hover:text-red-500 transition p-1"
              aria-label="Delete transaction"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
} 