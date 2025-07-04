import { DollarSign } from "lucide-react"

export default function Header() {
  return (
    <header className="w-full py-4 px-6 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <DollarSign className="text-green-600" size={24} />
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Finance Tracker</h1>
        </div>
        <span className="text-sm text-gray-600 hidden sm:block">Take control of your money 💰</span>
      </div>
    </header>
  )
}
  