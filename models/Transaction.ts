import mongoose from 'mongoose'

const TransactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['income', 'expense'], required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
}, { timestamps: true })

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema) 