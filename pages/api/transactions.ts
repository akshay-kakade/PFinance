import { connectDB } from '../../lib/mongodb'
import Transaction from '../../models/Transaction'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB()
  if (req.method === 'GET') {
    const transactions = await Transaction.find({})
    res.status(200).json(transactions)
  } else if (req.method === 'POST') {
    const transaction = await Transaction.create(req.body)
    res.status(201).json(transaction)
  } else if (req.method === 'DELETE') {
    const { id } = req.query
    await Transaction.findByIdAndDelete(id)
    res.status(204).end()
  } else {
    res.status(405).end()
  }
} 